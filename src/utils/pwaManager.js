/**
 * Professor Virus — PWA Installation & Platform Detection Manager
 * Universal support for Android (Chrome, Samsung Internet, Edge, etc.) & iOS (Safari, In-App Webview)
 */

const DISMISS_KEY = 'pv_pwa_dismissed_until';
const INSTALLED_KEY = 'pv_pwa_installed';

let deferredPrompt = null;
const promptListeners = new Set();

/**
 * Capture beforeinstallprompt as early as possible and preserve it in memory.
 */
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default mini-infobar or automatic browser banner
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] beforeinstallprompt captured and preserved');
    notifyPromptListeners();
    window.dispatchEvent(new CustomEvent('pwa-prompt-available', { detail: { hasPrompt: true } }));
  });

  window.addEventListener('appinstalled', (e) => {
    console.log('[PWA] Application installed successfully');
    deferredPrompt = null;
    try {
      localStorage.setItem(INSTALLED_KEY, 'true');
    } catch (err) {}
    notifyPromptListeners();
    window.dispatchEvent(new CustomEvent('pwa-installed'));
  });
}

function notifyPromptListeners() {
  const hasPrompt = Boolean(deferredPrompt);
  promptListeners.forEach((listener) => {
    try {
      listener(hasPrompt);
    } catch (err) {
      console.error('[PWA] Error in prompt listener:', err);
    }
  });
}

/**
 * Device, Platform, and Browser Detection
 */
export function getPlatformInfo() {
  if (typeof window === 'undefined') {
    return {
      isAndroid: false,
      isIOS: false,
      isMobile: false,
      isStandalone: false,
      browserName: 'unknown',
      isInAppBrowser: false,
      canUseNativePrompt: false
    };
  }

  const ua = window.navigator.userAgent || '';
  const vendor = window.navigator.vendor || '';

  // 1. Operating System
  const isAndroid = /Android/i.test(ua);
  const isIOS =
    /iPhone|iPad|iPod/i.test(ua) ||
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

  // 2. Standalone / Installed Detection
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    window.navigator.standalone === true ||
    (typeof document !== 'undefined' && document.referrer.includes('android-app://')) ||
    new URLSearchParams(window.location.search).get('source') === 'pwa';

  // 3. In-App Browser Detection (Instagram, Facebook, LinkedIn, Gmail, Twitter, etc.)
  const isInAppBrowser =
    /FBAN|FBAV|Instagram|LinkedInApp|Line|Twitter|Snapchat|MicroMessenger|musical_ly|BytedanceWebview/i.test(ua) ||
    (isIOS && !window.navigator.standalone && !/Safari/i.test(ua));

  // 4. Specific Mobile Browser Detection
  let browserName = 'other';
  if (/SamsungBrowser/i.test(ua)) {
    browserName = 'samsung';
  } else if (/EdgA|EdgiOS|Edge/i.test(ua)) {
    browserName = 'edge';
  } else if (/OPR|OPT|Opera/i.test(ua)) {
    browserName = 'opera';
  } else if (/Firefox|FxiOS/i.test(ua)) {
    browserName = 'firefox';
  } else if (/Brave/i.test(ua) || (window.navigator.brave && typeof window.navigator.brave.isBrave === 'function')) {
    browserName = 'brave';
  } else if (/CriOS/i.test(ua)) {
    browserName = 'chrome-ios';
  } else if (isAndroid && /Chrome/i.test(ua)) {
    browserName = 'chrome-android';
  } else if (isIOS && /Safari/i.test(ua) && !isInAppBrowser) {
    browserName = 'safari-ios';
  } else if (!isMobileUserAgent(ua) && /Chrome/i.test(ua)) {
    browserName = 'chrome-desktop';
  }

  const isMobile = isAndroid || isIOS || window.innerWidth <= 1024 || isMobileUserAgent(ua);

  return {
    isAndroid,
    isIOS,
    isMobile,
    isStandalone,
    browserName,
    isInAppBrowser,
    canUseNativePrompt: Boolean(deferredPrompt)
  };
}

function isMobileUserAgent(ua) {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

/**
 * Check if the app is already installed or running in standalone mode.
 */
export function isAppInstalled() {
  const { isStandalone } = getPlatformInfo();
  if (isStandalone) return true;
  try {
    return localStorage.getItem(INSTALLED_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

/**
 * Check if the user has dismissed the install prompt within the last 7 days.
 */
export function isPromptDismissed() {
  try {
    const val = localStorage.getItem(DISMISS_KEY);
    if (!val) return false;
    const expiry = parseInt(val, 10);
    if (isNaN(expiry)) return false;
    return Date.now() < expiry;
  } catch (e) {
    return false;
  }
}

/**
 * Suppress the automatic popup for 7 days (or custom duration).
 */
export function dismissPrompt(days = 7) {
  try {
    const expiry = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_KEY, expiry.toString());
  } catch (e) {}
}

/**
 * Determines whether the automatic popup should display.
 */
export function shouldShowAutoPrompt() {
  const { isStandalone, isMobile } = getPlatformInfo();
  if (isStandalone) return false;
  if (isAppInstalled()) return false;
  if (isPromptDismissed()) return false;
  return isMobile;
}

/**
 * Trigger the installation flow:
 * - If Android/browser has deferred beforeinstallprompt, invokes native prompt.
 * - Otherwise returns appropriate fallback code so the UI can display interactive tutorial.
 */
export async function promptInstall() {
  if (deferredPrompt) {
    try {
      // Invoke native installation prompt
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      console.log('[PWA] User choice:', choiceResult.outcome);

      if (choiceResult.outcome === 'accepted') {
        try {
          localStorage.setItem(INSTALLED_KEY, 'true');
        } catch (e) {}
        deferredPrompt = null;
        notifyPromptListeners();
        return { success: true, outcome: 'accepted', method: 'native' };
      } else {
        // User dismissed the browser prompt
        dismissPrompt(7);
        return { success: false, outcome: 'dismissed', method: 'native' };
      }
    } catch (err) {
      console.warn('[PWA] Native prompt execution error:', err);
    }
  }

  // Native prompt not currently available -> fall back to step-by-step tutorial
  const { isIOS, isAndroid } = getPlatformInfo();
  if (isIOS) {
    return { success: false, fallback: 'ios_safari' };
  } else if (isAndroid) {
    return { success: false, fallback: 'android_manual' };
  }
  return { success: false, fallback: 'desktop_manual' };
}

/**
 * Subscribe to changes in native beforeinstallprompt availability.
 */
export function subscribeToInstallPrompt(callback) {
  promptListeners.add(callback);
  callback(Boolean(deferredPrompt));
  return () => promptListeners.delete(callback);
}

/**
 * Open the installation modal explicitly from any menu or button.
 */
export function openInstallModal(source = 'menu') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('open-pwa-install', {
        detail: { source, timestamp: Date.now() }
      })
    );
  }
}

/**
 * Register Service Worker safely.
 */
export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        console.log('[PWA] Service Worker registered with scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker registration failed:', err);
      });
  });
}
