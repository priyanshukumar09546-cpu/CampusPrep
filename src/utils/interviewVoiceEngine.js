// ============================================================================
// PROFESSORVIRUS — INTERVIEW PRO: VOICE SYNTHESIS ENGINE
// High-Fidelity Natural Female Voice for AI Technical & HR Interviews
//
// Features:
// 1. Asynchronous voice enumeration with cross-browser onvoiceschanged support
// 2. Intelligent voice selection prioritizing natural, polished female voices
//    (Samantha, Victoria, Karen, Google UK/US Female, Microsoft Zira, etc.)
// 3. Calibrated pitch (1.05) and rate (0.96) for crisp, professional delivery
// 4. Mute/Unmute state management & Replay support
// 5. Lifecycle safety: avoids overlapping speech, stops before mic recording,
//    and ensures clean cancellation on unmount/navigation
// ============================================================================

// Priority list for natural female voices across iOS, macOS, Android, Windows, and ChromeOS
const PREFERRED_FEMALE_VOICE_NAMES = [
  'samantha',
  'victoria',
  'karen',
  'google uk english female',
  'google us english female',
  'microsoft zira',
  'microsoft jenny',
  'microsoft aria',
  'fiona',
  'moira',
  'tessa',
  'ava',
  'allison',
  'serena',
  'susan'
];

let cachedVoices = [];
let voicesLoadedPromise = null;

/**
 * Initializes and fetches available system voices asynchronously.
 * Supports Chrome, Edge, Safari (iOS/macOS), and Firefox.
 */
export function getAvailableVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return Promise.resolve([]);
  }

  if (cachedVoices.length > 0) {
    return Promise.resolve(cachedVoices);
  }

  if (!voicesLoadedPromise) {
    voicesLoadedPromise = new Promise((resolve) => {
      const synth = window.speechSynthesis;
      const initial = synth.getVoices();
      if (initial && initial.length > 0) {
        cachedVoices = initial;
        resolve(initial);
        return;
      }

      const handler = () => {
        const loaded = synth.getVoices();
        if (loaded && loaded.length > 0) {
          cachedVoices = loaded;
          synth.removeEventListener('voiceschanged', handler);
          resolve(loaded);
        }
      };

      synth.addEventListener('voiceschanged', handler);

      // Fallback timeout in case voiceschanged never fires (e.g. headless or unsupported)
      setTimeout(() => {
        const fallback = synth.getVoices();
        cachedVoices = fallback || [];
        resolve(cachedVoices);
      }, 500);
    });
  }

  return voicesLoadedPromise;
}

/**
 * Selects the highest quality natural female English voice available on the device.
 */
export function selectBestFemaleVoice(voices = []) {
  if (!voices || voices.length === 0) return null;

  const englishVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
  const candidatePool = englishVoices.length > 0 ? englishVoices : voices;

  // 1. Check for specific top-tier polished female voice names
  for (const preferred of PREFERRED_FEMALE_VOICE_NAMES) {
    const match = candidatePool.find(v => v.name && v.name.toLowerCase().includes(preferred));
    if (match) return match;
  }

  // 2. Check for generic "female" or "woman" descriptors in English voices
  const genericFemale = candidatePool.find(v => {
    const name = (v.name || '').toLowerCase();
    return (name.includes('female') || name.includes('woman') || name.includes('girl')) && !name.includes('male');
  });
  if (genericFemale) return genericFemale;

  // 3. Fallback to high-quality "natural" or "neural" English voices
  const naturalVoice = candidatePool.find(v => {
    const name = (v.name || '').toLowerCase();
    return name.includes('natural') || name.includes('neural') || name.includes('online');
  });
  if (naturalVoice) return naturalVoice;

  // 4. First English voice or default system voice
  return candidatePool[0] || voices[0] || null;
}

/**
 * Speaks the given interview question aloud using natural female voice settings.
 *
 * @param {string} text - The question or conversational dialogue to speak
 * @param {Object} options - Callbacks and overrides
 * @returns {SpeechSynthesisUtterance|null}
 */
export async function speakInterviewQuestion(text, options = {}) {
  const {
    onStart = () => {},
    onEnd = () => {},
    onError = () => {},
    isMuted = false,
    rate = 0.96,
    pitch = 1.05
  } = options;

  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    onEnd();
    return null;
  }

  // Always cancel any prior or active speech immediately
  stopInterviewSpeech();

  if (isMuted || !text || !text.trim()) {
    onEnd();
    return null;
  }

  const voices = await getAvailableVoices();
  const femaleVoice = selectBestFemaleVoice(voices);

  const utterance = new window.SpeechSynthesisUtterance(text.trim());
  utterance.rate = rate;
  utterance.pitch = pitch;

  if (femaleVoice) {
    utterance.voice = femaleVoice;
    utterance.lang = femaleVoice.lang || 'en-US';
  } else {
    utterance.lang = 'en-US';
  }

  utterance.onstart = () => {
    try { onStart(); } catch {}
  };

  utterance.onend = () => {
    try { onEnd(); } catch {}
  };

  utterance.onerror = (err) => {
    // Treat 'canceled' or 'interrupted' as clean stops rather than errors
    if (err && (err.error === 'canceled' || err.error === 'interrupted')) {
      try { onEnd(); } catch {}
      return;
    }
    console.warn('[InterviewVoiceEngine] Utterance error:', err);
    try { onError(err); } catch {}
    try { onEnd(); } catch {}
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

/**
 * Stops all ongoing speech immediately and cleans up the synthesizer queue.
 */
export function stopInterviewSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

/**
 * Checks if browser supports SpeechSynthesis
 */
export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}
