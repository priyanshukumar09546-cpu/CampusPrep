// ============================================================================
// PROFESSORVIRUS — INTERVIEW PRO PROCTORING & WEBCAM SUBSYSTEM
// Enforces mandatory webcam and microphone verification across all 4 rounds:
// 1. Aptitude
// 2. Coding
// 3. AI Technical Interview
// 4. AI HR / Behavioral Interview
// Handles:
// - Hardware enumeration & permission verification
// - Persistent MediaStream retention across rounds
// - Real-time track disconnection & device change detection
// - Session lockout modals during camera/mic disconnections
// - Auto-reconnection & event logging
// ============================================================================

import { API_URL } from '../config/api';

let activeMediaStream = null;
const proctorListeners = new Set();
let deviceChangeBound = false;

/**
 * Register a listener for proctoring events
 * e.g. { type: 'CAMERA_DISCONNECTED' | 'CAMERA_RECONNECTED' | 'MIC_DISCONNECTED' | 'MIC_RECONNECTED' }
 */
export function subscribeProctorEvents(listener) {
  proctorListeners.add(listener);
  return () => {
    proctorListeners.delete(listener);
  };
}

function notifyListeners(event) {
  proctorListeners.forEach(fn => {
    try {
      fn(event);
    } catch (e) {
      console.warn('[PROCTOR] Listener error:', e);
    }
  });
}

/**
 * Returns currently active MediaStream, or null
 */
export function getActiveMediaStream() {
  if (activeMediaStream && activeMediaStream.active) {
    return activeMediaStream;
  }
  return null;
}

/**
 * Attaches disconnection monitors to track objects
 */
function bindTrackMonitors(stream, attemptId) {
  if (!stream) return;

  const videoTracks = stream.getVideoTracks();
  if (videoTracks.length > 0) {
    const vt = videoTracks[0];
    vt.onended = () => {
      console.warn('[PROCTOR] Video track ended / camera disconnected');
      const eventData = { type: 'CAMERA_DISCONNECTED', timestamp: Date.now() };
      notifyListeners(eventData);
      logProctorEvent(attemptId, 'CAMERA_DISCONNECTED', { reason: 'track_ended' });
    };
  }

  const audioTracks = stream.getAudioTracks();
  if (audioTracks.length > 0) {
    const at = audioTracks[0];
    at.onended = () => {
      console.warn('[PROCTOR] Audio track ended / mic disconnected');
      const eventData = { type: 'MIC_DISCONNECTED', timestamp: Date.now() };
      notifyListeners(eventData);
      logProctorEvent(attemptId, 'MIC_DISCONNECTED', { reason: 'track_ended' });
    };
  }

  // Listen to physical device changes (unplugging USB webcam / headset)
  if (!deviceChangeBound && typeof navigator !== 'undefined' && navigator.mediaDevices) {
    deviceChangeBound = true;
    navigator.mediaDevices.addEventListener('devicechange', async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(d => d.kind === 'videoinput');
        const hasMic = devices.some(d => d.kind === 'audioinput');

        if (!hasCamera) {
          console.warn('[PROCTOR] No video devices detected on devicechange event');
          const eventData = { type: 'CAMERA_DISCONNECTED', timestamp: Date.now() };
          notifyListeners(eventData);
          logProctorEvent(attemptId, 'CAMERA_DISCONNECTED', { reason: 'device_removed' });
        }

        if (!hasMic) {
          console.warn('[PROCTOR] No audio devices detected on devicechange event');
          const eventData = { type: 'MIC_DISCONNECTED', timestamp: Date.now() };
          notifyListeners(eventData);
          logProctorEvent(attemptId, 'MIC_DISCONNECTED', { reason: 'device_removed' });
        }
      } catch (err) {
        console.warn('[PROCTOR] devicechange check failed:', err);
      }
    });
  }
}

/**
 * Checks if hardware devices exist before asking permissions
 */
export async function enumerateAvailableDevices() {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return {
      supported: false,
      hasCamera: false,
      hasMic: false,
      videoInputs: [],
      audioInputs: []
    };
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(d => d.kind === 'videoinput');
    const audioInputs = devices.filter(d => d.kind === 'audioinput');
    return {
      supported: true,
      hasCamera: videoInputs.length > 0,
      hasMic: audioInputs.length > 0,
      videoInputs,
      audioInputs
    };
  } catch (e) {
    return {
      supported: true,
      hasCamera: true, // may be hidden before permission
      hasMic: true,
      videoInputs: [],
      audioInputs: []
    };
  }
}

/**
 * Primary Device Verification Gate
 * Requests camera and microphone streams, validates tracks, and stores verification state.
 */
export async function verifyCameraAndMicrophone(options = {}) {
  const attemptId = options.attemptId || 'PROCTOR_PRECHECK';

  if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return {
      success: false,
      cameraStatus: 'ERROR',
      micStatus: 'ERROR',
      errorMessage: 'Browser does not support camera and microphone access. Please use Chrome, Edge, or Firefox.'
    };
  }

  // Pre-check physical device presence if available
  const enumInfo = await enumerateAvailableDevices();
  if (enumInfo.supported && enumInfo.videoInputs.length === 0 && enumInfo.audioInputs.length === 0) {
    // Both missing
    return {
      success: false,
      cameraStatus: 'NOT_FOUND',
      micStatus: 'NOT_FOUND',
      errorMessage: 'No webcam or microphone detected. Please connect your webcam and microphone and click Check again.'
    };
  }

  // Re-use active stream if already live and healthy
  if (activeMediaStream && activeMediaStream.active) {
    const vt = activeMediaStream.getVideoTracks();
    const at = activeMediaStream.getAudioTracks();
    const hasLiveVideo = vt.length > 0 && vt[0].readyState === 'live';
    const hasLiveAudio = at.length > 0 && at[0].readyState === 'live';

    if (hasLiveVideo && hasLiveAudio) {
      sessionStorage.setItem('interview_pro_devices_verified', 'true');
      return {
        success: true,
        cameraStatus: 'CONNECTED',
        micStatus: 'CONNECTED',
        stream: activeMediaStream
      };
    }
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        frameRate: { ideal: 24, max: 30 }
      },
      audio: true
    });

    const videoTracks = stream.getVideoTracks();
    const audioTracks = stream.getAudioTracks();

    if (videoTracks.length === 0) {
      return {
        success: false,
        cameraStatus: 'NOT_FOUND',
        micStatus: audioTracks.length > 0 ? 'CONNECTED' : 'NOT_FOUND',
        errorMessage: 'No webcam video stream received. Connect a webcam and try again.'
      };
    }

    if (audioTracks.length === 0) {
      return {
        success: false,
        cameraStatus: 'CONNECTED',
        micStatus: 'NOT_FOUND',
        errorMessage: 'No microphone audio stream received. Connect a microphone and try again.'
      };
    }

    activeMediaStream = stream;
    bindTrackMonitors(stream, attemptId);

    // Persist verified status for the active session
    sessionStorage.setItem('interview_pro_devices_verified', 'true');
    sessionStorage.setItem('interview_pro_devices_verified_at', new Date().toISOString());

    return {
      success: true,
      cameraStatus: 'CONNECTED',
      micStatus: 'CONNECTED',
      stream
    };
  } catch (err) {
    const name = err.name || '';
    console.error('[PROCTOR VERIFICATION ERROR]:', name, err.message);

    if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
      return {
        success: false,
        cameraStatus: 'DENIED',
        micStatus: 'DENIED',
        errorMessage: 'Camera or microphone permission denied. Please click the lock/camera icon in your browser address bar, set Camera & Microphone to Allow, and try again.'
      };
    }

    if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
      return {
        success: false,
        cameraStatus: 'NOT_FOUND',
        micStatus: 'NOT_FOUND',
        errorMessage: 'No physical webcam or microphone detected. Please plug in a webcam and microphone to continue.'
      };
    }

    if (name === 'NotReadableError' || name === 'TrackStartError') {
      return {
        success: false,
        cameraStatus: 'ERROR',
        micStatus: 'ERROR',
        errorMessage: 'Your webcam or microphone is already in use by another application (e.g. Zoom, Teams, or another tab). Please close other apps and try again.'
      };
    }

    return {
      success: false,
      cameraStatus: 'ERROR',
      micStatus: 'ERROR',
      errorMessage: err.message || 'Unable to access camera and microphone.'
    };
  }
}

/**
 * Reconnects Camera after a disconnection event
 */
export async function reconnectWebcam(attemptId) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        frameRate: { ideal: 24, max: 30 }
      }
    });

    const newVideoTrack = stream.getVideoTracks()[0];
    if (!newVideoTrack) {
      throw new Error('No video track returned');
    }

    if (activeMediaStream) {
      // Remove old video tracks
      activeMediaStream.getVideoTracks().forEach(t => {
        try { t.stop(); } catch(e) {}
        activeMediaStream.removeTrack(t);
      });
      activeMediaStream.addTrack(newVideoTrack);
    } else {
      activeMediaStream = stream;
    }

    bindTrackMonitors(activeMediaStream, attemptId);
    notifyListeners({ type: 'CAMERA_RECONNECTED', timestamp: Date.now() });
    logProctorEvent(attemptId, 'CAMERA_RECONNECTED', { timestamp: Date.now() });

    return { success: true, stream: activeMediaStream };
  } catch (err) {
    console.error('[PROCTOR RECONNECT CAMERA ERROR]:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Reconnects Microphone after a disconnection event
 */
export async function reconnectMicrophone(attemptId) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const newAudioTrack = stream.getAudioTracks()[0];
    if (!newAudioTrack) {
      throw new Error('No audio track returned');
    }

    if (activeMediaStream) {
      activeMediaStream.getAudioTracks().forEach(t => {
        try { t.stop(); } catch(e) {}
        activeMediaStream.removeTrack(t);
      });
      activeMediaStream.addTrack(newAudioTrack);
    } else {
      activeMediaStream = stream;
    }

    bindTrackMonitors(activeMediaStream, attemptId);
    notifyListeners({ type: 'MIC_RECONNECTED', timestamp: Date.now() });
    logProctorEvent(attemptId, 'MIC_RECONNECTED', { timestamp: Date.now() });

    return { success: true, stream: activeMediaStream };
  } catch (err) {
    console.error('[PROCTOR RECONNECT MIC ERROR]:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Disconnects and releases hardware media stream on test completion
 */
export function stopProctorStream() {
  if (activeMediaStream) {
    try {
      activeMediaStream.getTracks().forEach(t => t.stop());
    } catch (e) {}
    activeMediaStream = null;
  }
}

/**
 * Checks if candidate has verified devices for current session
 */
export function isCandidateDeviceVerified() {
  try {
    return sessionStorage.getItem('interview_pro_devices_verified') === 'true';
  } catch {
    return false;
  }
}

/**
 * Clear verification state
 */
export function clearDeviceVerification() {
  try {
    sessionStorage.removeItem('interview_pro_devices_verified');
    sessionStorage.removeItem('interview_pro_devices_verified_at');
  } catch {}
  stopProctorStream();
}

/**
 * Logs proctoring events (disconnections, reconnections) to backend & local storage
 */
export async function logProctorEvent(attemptId, eventType, details = {}) {
  const timestamp = new Date().toISOString();
  const eventPayload = {
    attemptId: attemptId || 'ACTIVE_SESSION',
    eventType,
    details,
    timestamp
  };

  // Local record in attempt session
  try {
    const key = `interview_pro_events_${attemptId}`;
    const raw = localStorage.getItem(key);
    const events = raw ? JSON.parse(raw) : [];
    events.push(eventPayload);
    localStorage.setItem(key, JSON.stringify(events.slice(-50)));
  } catch (e) {}

  // Remote backend record
  try {
    fetch(`${API_URL}/api/interview/proctor/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload)
    }).catch(() => {});
  } catch (e) {}
}
