import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Share2,
  PlusSquare,
  MoreVertical,
  Menu as MenuIcon,
  Compass,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Layers,
  ArrowRight,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import {
  getPlatformInfo,
  shouldShowAutoPrompt,
  dismissPrompt,
  promptInstall,
  subscribeToInstallPrompt,
  isAppInstalled
} from '../utils/pwaManager';

export default function PWAInstallPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('prompt'); // 'prompt' | 'tutorial'
  const [platform, setPlatform] = useState(() => getPlatformInfo());
  const [hasNativePrompt, setHasNativePrompt] = useState(false);
  const [selectedBrowserTab, setSelectedBrowserTab] = useState('chrome'); // 'chrome' | 'samsung' | 'safari' | 'other'
  const [installedSuccess, setInstalledSuccess] = useState(false);
  const [isPrompting, setIsPrompting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Initial platform & prompt state sync
  useEffect(() => {
    const currentPlatform = getPlatformInfo();
    setPlatform(currentPlatform);

    // Default browser tutorial tab based on detected browser
    if (currentPlatform.isIOS) {
      setSelectedBrowserTab('safari');
    } else if (currentPlatform.browserName === 'samsung') {
      setSelectedBrowserTab('samsung');
    } else {
      setSelectedBrowserTab('chrome');
    }

    // Subscribe to native prompt availability
    const unsubscribe = subscribeToInstallPrompt((available) => {
      setHasNativePrompt(available);
    });

    // Check automatic prompt with a smooth polite delay (3.5 seconds)
    const timer = setTimeout(() => {
      if (shouldShowAutoPrompt()) {
        setIsOpen(true);
      }
    }, 3500);

    // Listen for manual trigger from menu buttons or external components
    const handleOpenRequest = (e) => {
      const refreshedPlatform = getPlatformInfo();
      setPlatform(refreshedPlatform);
      if (refreshedPlatform.isIOS) {
        setSelectedBrowserTab('safari');
      } else if (refreshedPlatform.browserName === 'samsung') {
        setSelectedBrowserTab('samsung');
      } else {
        setSelectedBrowserTab('chrome');
      }
      setActiveTab(refreshedPlatform.isIOS || !hasNativePrompt ? 'tutorial' : 'prompt');
      setIsOpen(true);
    };

    const handleInstalled = () => {
      setInstalledSuccess(true);
      setHasNativePrompt(false);
      setTimeout(() => {
        setIsOpen(false);
        setInstalledSuccess(false);
      }, 2500);
    };

    window.addEventListener('open-pwa-install', handleOpenRequest);
    window.addEventListener('pwa-installed', handleInstalled);

    return () => {
      clearTimeout(timer);
      unsubscribe();
      window.removeEventListener('open-pwa-install', handleOpenRequest);
      window.removeEventListener('pwa-installed', handleInstalled);
    };
  }, [hasNativePrompt]);

  // Close with 7-day suppression
  const handleDismiss = () => {
    dismissPrompt(7);
    setIsOpen(false);
  };

  // Immediate close without resetting dismissal (for manual closes or X button)
  const handleClose = () => {
    dismissPrompt(7);
    setIsOpen(false);
  };

  // Handle Primary Button Tap ("Add to Home Screen")
  const handlePrimaryClick = async () => {
    if (platform.isStandalone) {
      setIsOpen(false);
      return;
    }

    if (platform.isIOS) {
      // iOS doesn't support native beforeinstallprompt -> open visual guide
      setActiveTab('tutorial');
      return;
    }

    // On Android / Desktop:
    if (hasNativePrompt) {
      setIsPrompting(true);
      try {
        const result = await promptInstall();
        setIsPrompting(false);
        if (result.success) {
          setInstalledSuccess(true);
          setTimeout(() => {
            setIsOpen(false);
            setInstalledSuccess(false);
          }, 2400);
        } else if (result.outcome === 'dismissed') {
          // User tapped cancel on browser prompt
          setIsOpen(false);
        } else {
          // If prompt was unexpectedly missing or rejected, switch to manual tutorial
          setActiveTab('tutorial');
        }
      } catch (e) {
        setIsPrompting(false);
        setActiveTab('tutorial');
      }
    } else {
      // beforeinstallprompt not available yet -> show working browser guide
      setActiveTab('tutorial');
    }
  };

  // Copy site URL helper for in-app browsers
  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // If already standalone or modal not open, render nothing
  if (!isOpen || platform.isStandalone) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-title"
      className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="w-full max-w-[440px] sm:rounded-3xl rounded-t-3xl bg-[#0B0B0B] border border-[rgba(255,184,0,0.35)] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-slideUp"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 25px rgba(255, 184, 0, 0.15)'
        }}
      >
        {/* TOP ACCENT HEADER BANNER */}
        <div className="relative bg-gradient-to-r from-[#161616] via-[#111111] to-[#0B0B0B] border-b border-[rgba(255,184,0,0.25)] px-5 pt-4 pb-4 text-white overflow-hidden">
          {/* Subtle gold glow */}
          <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-[#FFB800]/10 blur-xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-28 h-28 rounded-full bg-[#FFB800]/10 blur-xl pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close installation popup"
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#161616] hover:bg-[#222222] border border-white/10 active:scale-95 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer z-10"
          >
            <X size={18} strokeWidth={2.4} />
          </button>

          {/* Logo & Platform Badge */}
          <div className="flex items-center gap-3.5 pr-8">
            <div className="relative w-13 h-13 rounded-2xl bg-[#050505] p-1 shadow-md border-2 border-[#FFB800] flex-shrink-0 flex items-center justify-center overflow-hidden">
              <img
                src="/assets/pwa-icon-192.png"
                alt="Professor Virus App Icon"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/assets/pwa-icon-512.png';
                }}
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#050505] flex items-center justify-center">
                <Check size={8} strokeWidth={3.5} className="text-white" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#161616] border border-[#FFB800]/30 text-[#FFB800] text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <Sparkles size={11} className="text-[#FFB800]" />
                <span>{platform.isIOS ? 'iOS Safari PWA' : platform.isAndroid ? 'Android Fast App' : 'Progressive Web App'}</span>
              </div>
              <h2
                id="pwa-install-title"
                className="font-['Outfit',sans-serif] text-lg sm:text-xl font-black text-white leading-tight tracking-tight drop-shadow-xs"
              >
                Install Professor Virus
              </h2>
            </div>
          </div>
        </div>

        {/* BODY CONTAINER */}
        <div className="p-5 overflow-y-auto flex-1 font-['Plus_Jakarta_Sans',sans-serif] text-zinc-200 bg-[#0B0B0B]">
          {installedSuccess ? (
            /* SUCCESS STATE */
            <div className="py-8 flex flex-col items-center text-center animate-scaleIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-inner">
                <CheckCircle2 size={36} strokeWidth={2.5} />
              </div>
              <h3 className="font-['Outfit',sans-serif] text-xl font-black text-white font-bold mb-1">
                App Installed Successfully!
              </h3>
              <p className="text-xs text-stone-600 max-w-xs leading-relaxed">
                Professor Virus is now installed on your home screen. Launch it anytime with instant access to Notes, PYQs and Tools!
              </p>
            </div>
          ) : activeTab === 'prompt' ? (
            /* DEFAULT PROMPT VIEW (ANDROID / DIRECT PROMPT) */
            <div className="space-y-4">
              <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                Notes, PYQs, Tools &amp; All Courses — right on your home screen.
              </p>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-2 gap-2.5 py-1">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#161616] border border-white/10 hover:border-[#FFB800]/40 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-[#222222] text-[#FFB800] flex items-center justify-center shadow-xs flex-shrink-0">
                    <Smartphone size={15} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-white leading-tight">Instant 1-Tap</div>
                    <div className="text-[9.5px] text-zinc-400">Home screen icon</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#161616] border border-white/10 hover:border-[#FFB800]/40 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-[#222222] text-emerald-400 flex items-center justify-center shadow-xs flex-shrink-0">
                    <Layers size={15} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-white leading-tight">Zero Storage</div>
                    <div className="text-[9.5px] text-zinc-400">&lt; 1 MB cached app</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#161616] border border-white/10 hover:border-[#FFB800]/40 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-[#222222] text-[#FFB800] flex items-center justify-center shadow-xs flex-shrink-0">
                    <Sparkles size={15} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-white leading-tight">Fast Offline</div>
                    <div className="text-[9.5px] text-zinc-400">Smooth caching</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#161616] border border-white/10 hover:border-[#FFB800]/40 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-[#222222] text-amber-400 flex items-center justify-center shadow-xs flex-shrink-0">
                    <ShieldCheck size={15} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-white leading-tight">Full Screen</div>
                    <div className="text-[9.5px] text-zinc-400">No browser address bar</div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-2 space-y-2">
                <button
                  id="pwa-add-to-home-btn"
                  type="button"
                  onClick={handlePrimaryClick}
                  disabled={isPrompting}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FFB800] via-[#FFA000] to-[#FF8C00] hover:brightness-110 active:scale-[0.99] text-black font-['Outfit',sans-serif] font-extrabold text-sm tracking-wide shadow-lg shadow-[#FFB800]/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                >
                  <Download size={18} strokeWidth={2.5} />
                  <span>{isPrompting ? 'Opening Install Prompt...' : 'Add to Home Screen'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    id="pwa-maybe-later-btn"
                    type="button"
                    onClick={handleDismiss}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#161616] hover:bg-[#222222] border border-white/10 active:scale-[0.99] text-zinc-300 font-semibold text-xs transition-colors cursor-pointer text-center"
                  >
                    Maybe Later
                  </button>

                  <button
                    id="pwa-how-to-install-btn"
                    type="button"
                    onClick={() => setActiveTab('tutorial')}
                    className="py-2.5 px-3 rounded-xl border border-[#FFB800]/40 hover:bg-[#FFB800]/10 active:scale-[0.99] text-[#FFB800] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>How to Install</span>
                    <ArrowRight size={13} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* STEP-BY-STEP TUTORIAL VIEW (iOS / IN-APP / ANDROID MANUAL) */
            <div id="pwa-tutorial-container" className="space-y-4">
              {/* Back to Quick View if prompt is available */}
              {hasNativePrompt && !platform.isIOS && (
                <button
                  type="button"
                  onClick={() => setActiveTab('prompt')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#FFB800] hover:underline cursor-pointer"
                >
                  ← Back to Quick Install
                </button>
              )}

              {/* IN-APP BROWSER ALERT (Instagram, FB, LinkedIn, Telegram) */}
              {platform.isInAppBrowser && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                  <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-bold mb-0.5">In-App Browser Detected</div>
                    <div className="text-[11px] leading-relaxed text-amber-800">
                      In-app browsers cannot install home screen apps. Tap the <strong>•••</strong> or Share menu in the corner and choose <strong>"Open in Safari / Chrome"</strong>.
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-900 text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      {copiedLink ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedLink ? 'Link Copied!' : 'Copy Website Link'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* BROWSER SELECTOR TABS */}
              <div>
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Select Your Mobile Browser
                </div>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#161616] border border-white/10 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setSelectedBrowserTab('safari')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedBrowserTab === 'safari'
                        ? 'bg-[#222222] text-[#FFB800] border border-[#FFB800]/40 shadow-xs'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    iPhone (Safari)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBrowserTab('chrome')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedBrowserTab === 'chrome'
                        ? 'bg-[#222222] text-[#FFB800] border border-[#FFB800]/40 shadow-xs'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Android Chrome
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBrowserTab('samsung')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedBrowserTab === 'samsung'
                        ? 'bg-[#222222] text-[#FFB800] border border-[#FFB800]/40 shadow-xs'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Samsung / Other
                  </button>
                </div>
              </div>

              {/* TUTORIAL STEPS */}
              {selectedBrowserTab === 'safari' ? (
                /* iPHONE SAFARI STEPS */
                <div className="space-y-3 bg-[#161616] p-3.5 rounded-2xl border border-white/10 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#FFB800] text-black font-black flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="text-xs leading-relaxed text-zinc-300">
                      Tap the <strong className="text-white font-bold">Share</strong> button in Safari's bottom toolbar.
                      <div className="inline-flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded-md bg-[#222222] border border-white/10 text-zinc-200 font-semibold align-middle">
                        <Share2 size={12} className="text-blue-600" />
                        <span>Share</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#FFB800] text-black font-black flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="text-xs leading-relaxed text-zinc-300">
                      Scroll down in the action list and select <strong className="text-white font-bold">"Add to Home Screen"</strong>.
                      <div className="inline-flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded-md bg-[#222222] border border-white/10 text-zinc-200 font-semibold align-middle">
                        <PlusSquare size={12} className="text-stone-700" />
                        <span>Add to Home Screen</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#FFB800] text-black font-black flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="text-xs leading-relaxed text-zinc-300">
                      Tap <strong className="text-blue-600 font-bold">"Add"</strong> in the top-right corner. The Professor Virus app will appear immediately on your iPhone home screen!
                    </div>
                  </div>
                </div>
              ) : selectedBrowserTab === 'samsung' ? (
                /* SAMSUNG INTERNET & OTHERS */
                <div className="space-y-3 bg-[#161616] p-3.5 rounded-2xl border border-white/10 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#FFB800] text-black font-black flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="text-xs leading-relaxed text-zinc-300">
                      Tap the <strong className="text-white font-bold">Menu</strong> button (three lines) in the bottom-right corner or the install icon in the URL bar.
                      <div className="inline-flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded-md bg-[#222222] border border-white/10 text-zinc-200 font-semibold align-middle">
                        <MenuIcon size={12} />
                        <span>Menu</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#FFB800] text-black font-black flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="text-xs leading-relaxed text-zinc-300">
                      Tap <strong className="text-white font-bold">"Add page to"</strong>.
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#FFB800] text-black font-black flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="text-xs leading-relaxed text-zinc-300">
                      Select <strong className="text-[#861820] font-bold">"App screen"</strong> or <strong className="text-[#861820] font-bold">"Home screen"</strong> and tap <strong className="text-white font-bold font-bold">Install</strong>.
                    </div>
                  </div>
                </div>
              ) : (
                /* ANDROID CHROME / BRAVE / EDGE */
                <div className="space-y-3 bg-[#161616] p-3.5 rounded-2xl border border-white/10 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#FFB800] text-black font-black flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="text-xs leading-relaxed text-zinc-300">
                      Tap the <strong className="text-white font-bold">Three Dots</strong> menu in the top-right corner of your browser.
                      <div className="inline-flex items-center gap-0.5 ml-1 px-1.5 py-0.5 rounded-md bg-[#222222] border border-white/10 text-zinc-200 font-semibold align-middle">
                        <MoreVertical size={12} />
                        <span>Menu</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#FFB800] text-black font-black flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="text-xs leading-relaxed text-zinc-300">
                      Look for <strong className="text-[#861820] font-bold">"Install app"</strong> or <strong className="text-white font-bold">"Add to Home screen"</strong>.
                      <div className="inline-flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded-md bg-[#222222] border border-white/10 text-zinc-200 font-semibold align-middle">
                        <Download size={12} className="text-[#861820]" />
                        <span>Install app</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#FFB800] text-black font-black flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="text-xs leading-relaxed text-zinc-300">
                      Confirm by tapping <strong className="text-white font-bold font-bold">"Install"</strong>. The app installs directly into your Android app drawer and home screen.
                    </div>
                  </div>
                </div>
              )}

              {/* FOOTER BUTTONS */}
              <div className="pt-2 flex items-center gap-2">
                {hasNativePrompt && !platform.isIOS ? (
                  <button
                    type="button"
                    onClick={handlePrimaryClick}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#FFB800] to-[#FF8C00] text-black font-extrabold font-['Outfit',sans-serif] font-bold text-xs tracking-wide shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download size={16} />
                    <span>Try Automatic Install</span>
                  </button>
                ) : (
                  <button
                    id="pwa-tutorial-got-it-btn"
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#FFB800] to-[#FF8C00] text-black font-extrabold font-['Outfit',sans-serif] font-bold text-xs tracking-wide shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Got It</span>
                  </button>
                )}

                <button
                  id="pwa-tutorial-maybe-later-btn"
                  type="button"
                  onClick={handleDismiss}
                  className="py-3 px-4 rounded-xl bg-[#161616] hover:bg-[#222222] border border-white/10 text-zinc-300 font-semibold text-xs cursor-pointer"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM SAFE AREA ACCENT */}
        <div className="px-5 py-2.5 bg-[#050505] border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>Verified PWA by Professor Virus</span>
          </div>
          <span>v1.0 • No App Store required</span>
        </div>
      </div>
    </div>
  );
}
