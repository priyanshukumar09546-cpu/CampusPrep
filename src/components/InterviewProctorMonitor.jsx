import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Video,
  VideoOff,
  Mic,
  MicOff,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Minimize2,
  Maximize2
} from 'lucide-react';
import {
  getActiveMediaStream,
  subscribeProctorEvents,
  reconnectWebcam,
  reconnectMicrophone,
  logProctorEvent
} from '../utils/interviewProctoring';

/**
 * Universal Interview Proctor Monitor
 * Displays live webcam feed during all active rounds (Aptitude, Coding, Technical, HR).
 * Intercepts camera/mic disconnects and displays modal lockout until restored.
 */
export default function InterviewProctorMonitor({
  attemptId = 'ACTIVE_SESSION',
  roundName = 'Aptitude',
  checkMic = false,
  position = 'bottom-right' // 'bottom-right' | 'top-right'
}) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(() => getActiveMediaStream());
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isMicActive, setIsMicActive] = useState(true);
  const [cameraDisconnected, setCameraDisconnected] = useState(false);
  const [micDisconnected, setMicDisconnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectError, setReconnectError] = useState(null);
  const [reconnectedToast, setReconnectedToast] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sync stream to video element
  useEffect(() => {
    const curStream = getActiveMediaStream();
    if (curStream) {
      setStream(curStream);
      if (videoRef.current && videoRef.current.srcObject !== curStream) {
        videoRef.current.srcObject = curStream;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [stream]);

  // Periodic heartbeat ensuring video track is still live
  useEffect(() => {
    const interval = setInterval(() => {
      const cur = getActiveMediaStream();
      if (!cur) {
        setCameraDisconnected(true);
        setIsCameraActive(false);
      } else {
        const vt = cur.getVideoTracks();
        if (vt.length === 0 || vt[0].readyState !== 'live') {
          setCameraDisconnected(true);
          setIsCameraActive(false);
        } else {
          setIsCameraActive(true);
        }

        if (checkMic) {
          const at = cur.getAudioTracks();
          if (at.length === 0 || at[0].readyState !== 'live') {
            setMicDisconnected(true);
            setIsMicActive(false);
          } else {
            setIsMicActive(true);
          }
        }
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [checkMic]);

  // Subscribe to proctoring events
  useEffect(() => {
    const unsubscribe = subscribeProctorEvents((event) => {
      if (event.type === 'CAMERA_DISCONNECTED') {
        setCameraDisconnected(true);
        setIsCameraActive(false);
      } else if (event.type === 'CAMERA_RECONNECTED') {
        setCameraDisconnected(false);
        setIsCameraActive(true);
        setReconnectedToast('🟢 CAMERA RECONNECTED');
        setTimeout(() => setReconnectedToast(null), 3500);

        // Reattach stream to video
        const s = getActiveMediaStream();
        if (s && videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play().catch(() => {});
        }
      } else if (event.type === 'MIC_DISCONNECTED' && checkMic) {
        setMicDisconnected(true);
        setIsMicActive(false);
      } else if (event.type === 'MIC_RECONNECTED') {
        setMicDisconnected(false);
        setIsMicActive(true);
        setReconnectedToast('🟢 MICROPHONE RECONNECTED');
        setTimeout(() => setReconnectedToast(null), 3500);
      }
    });

    return () => unsubscribe();
  }, [checkMic]);

  // Reconnection Handlers
  const handleReconnectCamera = async () => {
    setIsReconnecting(true);
    setReconnectError(null);
    try {
      const res = await reconnectWebcam(attemptId);
      if (res.success && res.stream) {
        setStream(res.stream);
        setCameraDisconnected(false);
        setIsCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = res.stream;
          videoRef.current.play().catch(() => {});
        }
      } else {
        setReconnectError(res.error || 'Failed to reconnect webcam. Check USB connection or browser permissions.');
      }
    } catch (err) {
      setReconnectError(err.message || 'Webcam reconnection failed.');
    } finally {
      setIsReconnecting(false);
    }
  };

  const handleReconnectMic = async () => {
    setIsReconnecting(true);
    setReconnectError(null);
    try {
      const res = await reconnectMicrophone(attemptId);
      if (res.success && res.stream) {
        setStream(res.stream);
        setMicDisconnected(false);
        setIsMicActive(true);
      } else {
        setReconnectError(res.error || 'Failed to reconnect microphone. Check headset connection.');
      }
    } catch (err) {
      setReconnectError(err.message || 'Microphone reconnection failed.');
    } finally {
      setIsReconnecting(false);
    }
  };

  return (
    <>
      {/* =========================================================================
          1. RECONNECTED TOAST BANNER
          ========================================================================= */}
      {reconnectedToast && (
        <div
          data-testid="reconnected-toast"
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100000,
            backgroundColor: '#0E7A4A',
            color: '#FFFFFF',
            padding: '0.65rem 1.45rem',
            borderRadius: '999px',
            fontSize: '0.86rem',
            fontWeight: 800,
            boxShadow: '0 8px 24px rgba(14, 122, 74, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          <CheckCircle2 size={16} />
          <span>{reconnectedToast}</span>
        </div>
      )}

      {/* =========================================================================
          2. CAMERA DISCONNECTED LOCKOUT MODAL
          Appears immediately if webcam disconnects, locking test interaction
          ========================================================================= */}
      {cameraDisconnected && (
        <div
          data-testid="camera-disconnected-modal"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 12, 10, 0.88)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '2px solid #EF4444',
              padding: '2rem',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(220, 38, 38, 0.25)',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.15rem auto'
              }}
            >
              <VideoOff size={32} />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#FEF2F2',
                color: '#991B1B',
                padding: '0.3rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 800,
                marginBottom: '0.65rem'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#DC2626' }} />
              CAMERA DISCONNECTED
            </div>

            <h3
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.35rem',
                fontWeight: 900,
                color: '#1C1814',
                margin: '0 0 0.5rem 0'
              }}
            >
              🔴 Webcam Access Required
            </h3>

            <p
              style={{
                fontSize: '0.86rem',
                color: '#5A5044',
                lineHeight: 1.5,
                margin: '0 0 1.25rem 0'
              }}
            >
              Your webcam has been disconnected. Interview Pro requires continuous camera monitoring throughout all sections.
              The test is paused until your camera is reconnected.
            </p>

            {reconnectError && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#B91C1C',
                  fontSize: '0.78rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  textAlign: 'left'
                }}
              >
                {reconnectError}
              </div>
            )}

            <button
              type="button"
              data-testid="reconnect-webcam-btn"
              onClick={handleReconnectCamera}
              disabled={isReconnecting}
              style={{
                backgroundColor: '#781416',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '0.8rem 1.6rem',
                fontSize: '0.94rem',
                fontWeight: 800,
                cursor: isReconnecting ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(120, 20, 22, 0.3)',
                transition: 'all 0.15s ease',
                opacity: isReconnecting ? 0.7 : 1
              }}
            >
              <RefreshCw size={16} className={isReconnecting ? 'animate-spin' : ''} />
              <span>{isReconnecting ? 'Reconnecting Camera...' : '🔄 Reconnect Webcam'}</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. MICROPHONE DISCONNECTED LOCKOUT MODAL (For Tech & HR rounds)
          ========================================================================= */}
      {!cameraDisconnected && micDisconnected && checkMic && (
        <div
          data-testid="mic-disconnected-modal"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 12, 10, 0.88)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '2px solid #EF4444',
              padding: '2rem',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(220, 38, 38, 0.25)',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.15rem auto'
              }}
            >
              <MicOff size={32} />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#FEF2F2',
                color: '#991B1B',
                padding: '0.3rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 800,
                marginBottom: '0.65rem'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#DC2626' }} />
              MICROPHONE DISCONNECTED
            </div>

            <h3
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.35rem',
                fontWeight: 900,
                color: '#1C1814',
                margin: '0 0 0.5rem 0'
              }}
            >
              🔴 Microphone Access Required
            </h3>

            <p
              style={{
                fontSize: '0.86rem',
                color: '#5A5044',
                lineHeight: 1.5,
                margin: '0 0 1.25rem 0'
              }}
            >
              Your microphone is no longer available. This interview section requires speech recognition.
              Please reconnect your microphone or headset to continue.
            </p>

            {reconnectError && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#B91C1C',
                  fontSize: '0.78rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  textAlign: 'left'
                }}
              >
                {reconnectError}
              </div>
            )}

            <button
              type="button"
              data-testid="reconnect-mic-btn"
              onClick={handleReconnectMic}
              disabled={isReconnecting}
              style={{
                backgroundColor: '#781416',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '0.8rem 1.6rem',
                fontSize: '0.94rem',
                fontWeight: 800,
                cursor: isReconnecting ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(120, 20, 22, 0.3)',
                transition: 'all 0.15s ease',
                opacity: isReconnecting ? 0.7 : 1
              }}
            >
              <RefreshCw size={16} className={isReconnecting ? 'animate-spin' : ''} />
              <span>{isReconnecting ? 'Reconnecting Mic...' : '🔄 Reconnect Microphone'}</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. FLOATING LIVE PROCTOR MONITOR (Always visible during test)
          ========================================================================= */}
      <aside
        aria-label="Webcam Proctoring Monitor"
        data-testid="proctor-monitor"
        style={{
          position: 'fixed',
          bottom: position === 'bottom-right' ? '18px' : 'auto',
          top: position === 'top-right' ? '80px' : 'auto',
          right: '18px',
          zIndex: 8000,
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1.5px solid #E2D9CC',
          boxShadow: '0 8px 24px rgba(35, 30, 25, 0.18)',
          width: isCollapsed ? '190px' : '220px',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            backgroundColor: '#1E1915',
            color: '#FFFFFF',
            padding: '0.35rem 0.65rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            fontWeight: 800
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: isCameraActive ? '#22C55E' : '#EF4444',
                boxShadow: isCameraActive ? '0 0 8px #22C55E' : 'none'
              }}
            />
            <span style={{ letterSpacing: '0.5px' }}>
              {isCameraActive ? '● CAMERA ACTIVE' : 'CAMERA OFF'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(prev => !prev)}
            style={{
              background: 'none',
              border: 'none',
              color: '#D1C7BA',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center'
            }}
            title={isCollapsed ? 'Expand Preview' : 'Minimize Preview'}
          >
            {isCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Video Feed Window */}
        {!isCollapsed && (
          <div
            style={{
              position: 'relative',
              backgroundColor: '#0F0D0B',
              height: '135px',
              overflow: 'hidden'
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)' // Mirror preview
              }}
            />

            {/* Live Watermark Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: '6px',
                left: '6px',
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                color: '#22C55E',
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
              LIVE PREVIEW
            </div>
          </div>
        )}

        {/* Footer Status Indicators */}
        <div
          style={{
            padding: '0.4rem 0.65rem',
            backgroundColor: '#FAF7F2',
            borderTop: '1px solid #EFEAE3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.68rem',
            color: '#4A4036',
            fontWeight: 700
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Camera size={11} color={isCameraActive ? '#15803D' : '#DC2626'} />
            <span style={{ color: isCameraActive ? '#15803D' : '#DC2626' }}>
              {isCameraActive ? '🟢 Camera' : '🔴 Camera'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Mic size={11} color={isMicActive ? '#15803D' : '#DC2626'} />
            <span style={{ color: isMicActive ? '#15803D' : '#DC2626' }}>
              {isMicActive ? '🟢 Mic' : '🔴 Mic'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
