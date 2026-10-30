import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  X,
  Sparkles,
  ShieldCheck,
  Film
} from 'lucide-react';

export default function DemoVideoModal({
  isOpen,
  onClose,
  videoSrc = '/videos/professorvirus-demo.mp4',
  videoTitle = 'Discover ProfessorVirus — Complete Platform Tour'
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPlaybackStarted, setHasPlaybackStarted] = useState(false);

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Prevent background page scrolling when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  // Handle Playback Start & Pause on Close
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setShowControls(true);
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                setHasPlaybackStarted(true);
                setIsLoading(false);
              })
              .catch((err) => {
                console.warn('[DEMO VIDEO] Autoplay prevented:', err.message);
                setIsPlaying(false);
                setIsLoading(false);
              });
          }
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      // Pause immediately when modal closes
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
    }
  }, [isOpen]);

  // Escape key & Keyboard controls listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        seekRelative(5);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        seekRelative(-5);
      } else if (e.key === 'm') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPlaying, isMuted, isFullscreen]);

  // Track Fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Controls auto-hide on inactivity while playing
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        if (!isHovered) {
          setShowControls(false);
        }
      }, 2500);
    }
  };

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsPlaying(false);
    if (document.fullscreenElement) {
      try {
        document.exitFullscreen();
      } catch (e) {}
    }
    if (onClose) onClose();
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    if (!newMuted && volume === 0) {
      setVolume(0.8);
      videoRef.current.volume = 0.8;
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const seekRelative = (delta) => {
    if (!videoRef.current) return;
    const newT = Math.max(0, Math.min(duration, videoRef.current.currentTime + delta));
    videoRef.current.currentTime = newT;
    setCurrentTime(newT);
  };

  const handleSeek = (e) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const newT = pct * duration;
    videoRef.current.currentTime = newT;
    setCurrentTime(newT);
  };

  const restartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err.message);
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  if (!isOpen || typeof document === 'undefined') return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(15, 12, 10, 0.88)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.75rem, 2.5vw, 2rem)',
        boxSizing: 'border-box',
        animation: 'pvModalFadeIn 0.22s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="ProfessorVirus Demo Video Walkthrough"
    >
      {/* Centered Modal Card */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          maxWidth: '1040px',
          backgroundColor: '#1C1917',
          borderRadius: isFullscreen ? '0px' : '22px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65), 0 0 0 1.5px rgba(200, 141, 45, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'all 0.2s ease'
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.4rem',
            backgroundColor: '#781416',
            borderBottom: '2px solid #C88D2D',
            color: '#FFFFFF',
            zIndex: 10,
            flexShrink: 0
          }}
        >
          {/* Title & Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(200, 141, 45, 0.25)',
                border: '1px solid rgba(200, 141, 45, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFD700',
                flexShrink: 0
              }}
            >
              <Film size={17} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 'clamp(0.92rem, 1.6vw, 1.12rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.01em',
                    color: '#FAF5ED',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {videoTitle}
                </h3>
                <span
                  style={{
                    backgroundColor: 'rgba(200, 141, 45, 0.2)',
                    border: '1px solid rgba(200, 141, 45, 0.5)',
                    color: '#FFDF9E',
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Official Walkthrough • 60s
                </span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close demo video"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              flexShrink: 0,
              marginLeft: '0.8rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#991B1B';
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <X size={18} strokeWidth={2.4} />
          </button>
        </div>

        {/* 16:9 Video Canvas Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%', // 16:9 Aspect Ratio
            backgroundColor: '#0A0A0A',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src={videoSrc}
            playsInline
            preload="auto"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setDuration(videoRef.current.duration || 60);
                setIsLoading(false);
              }
            }}
            onEnded={() => {
              setIsPlaying(false);
              setShowControls(true);
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onWaiting={() => setIsLoading(true)}
            onPlaying={() => setIsLoading(false)}
          />

          {/* Large Center Play / Pause Indicator */}
          {(!isPlaying || !showControls) && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isPlaying ? 'transparent' : 'rgba(0, 0, 0, 0.35)',
                transition: 'all 0.2s ease',
                pointerEvents: 'none'
              }}
            >
              {!isPlaying && (
                <div
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '50%',
                    backgroundColor: '#781416',
                    border: '3px solid #C88D2D',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 30px rgba(120, 20, 22, 0.65), 0 0 20px rgba(200, 141, 45, 0.4)',
                    transform: 'scale(1)',
                    transition: 'transform 0.18s ease'
                  }}
                >
                  <Play size={32} fill="#FFFFFF" style={{ marginLeft: '4px' }} />
                </div>
              )}
            </div>
          )}

          {/* Video Bottom Custom Controls Bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(12, 10, 9, 0.95) 0%, rgba(12, 10, 9, 0.6) 70%, transparent 100%)',
              padding: '1.2rem 1.4rem 0.9rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              opacity: showControls || !isPlaying ? 1 : 0,
              pointerEvents: showControls || !isPlaying ? 'auto' : 'none',
              transition: 'opacity 0.25s ease',
              zIndex: 20
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Interactive Progress Seek Bar */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                borderRadius: '9999px',
                cursor: 'pointer',
                transition: 'height 0.15s ease'
              }}
              onClick={handleSeek}
              onMouseEnter={(e) => { e.currentTarget.style.height = '10px'; }}
              onMouseLeave={(e) => { e.currentTarget.style.height = '8px'; }}
              role="slider"
              aria-valuemin="0"
              aria-valuemax={duration}
              aria-valuenow={currentTime}
              aria-label="Seek progress"
            >
              {/* Completed Bar (Burgundy to Gold gradient) */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #781416 0%, #C88D2D 100%)',
                  borderRadius: '9999px'
                }}
              />

              {/* Scrubber Knob */}
              <div
                style={{
                  position: 'absolute',
                  left: `${progressPercent}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #C88D2D',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)'
                }}
              />
            </div>

            {/* Bottom Row of Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', color: '#FFFFFF' }}>
              {/* Left Controls: Play, Restart, Volume & Timer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                {/* Play / Pause Button */}
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FAF5ED',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    borderRadius: '6px',
                    transition: 'color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#C88D2D'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#FAF5ED'}
                >
                  {isPlaying ? <Pause size={20} fill="#FAF5ED" /> : <Play size={20} fill="#FAF5ED" />}
                </button>

                {/* Rewind / Restart Button */}
                <button
                  type="button"
                  onClick={restartVideo}
                  title="Replay from start"
                  aria-label="Replay from start"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FAF5ED',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    borderRadius: '6px',
                    transition: 'color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#C88D2D'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#FAF5ED'}
                >
                  <RotateCcw size={17} />
                </button>

                {/* Volume & Mute */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#FAF5ED',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#C88D2D'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#FAF5ED'}
                  >
                    {isMuted || volume === 0 ? <VolumeX size={19} /> : <Volume2 size={19} />}
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    aria-label="Volume slider"
                    style={{
                      width: '64px',
                      height: '4px',
                      accentColor: '#C88D2D',
                      cursor: 'pointer'
                    }}
                  />
                </div>

                {/* Time Display */}
                <div style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'monospace', color: '#FAF5ED', marginLeft: '0.2rem' }}>
                  <span>{formatTime(currentTime)}</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.5)', margin: '0 4px' }}>/</span>
                  <span style={{ color: '#C88D2D' }}>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Right Controls: HD Badge & Fullscreen */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    color: '#FFDF9E',
                    fontSize: '0.64rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.4rem',
                    borderRadius: '4px',
                    letterSpacing: '0.04em'
                  }}
                >
                  1080p HD
                </span>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FAF5ED',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    transition: 'color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#C88D2D'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#FAF5ED'}
                >
                  {isFullscreen ? <Minimize2 size={19} /> : <Maximize2 size={19} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Navigation Footer Strip */}
        <div
          style={{
            backgroundColor: '#141210',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.75rem 1.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.6rem',
            fontSize: '0.74rem',
            color: '#A8A29E'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#C88D2D', fontWeight: 800 }}>Walkthrough Chapters:</span>
            <span>Home</span> •
            <span>HOOLLOW</span> •
            <span>PYQs</span> •
            <span>Notes</span> •
            <span>Syllabus</span> •
            <span>Quizzes</span> •
            <span>Resume Maker</span> •
            <span>Interview Pro</span> •
            <span style={{ color: '#FCD34D', fontWeight: 700 }}>Result & CGPA</span> •
            <span style={{ color: '#C88D2D', fontWeight: 700 }}>More Tools (24+ Apps)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#D6D3D1', fontSize: '0.7rem', fontWeight: 600 }}>
            <ShieldCheck size={14} color="#C88D2D" />
            <span>100% Free Educational Platform for Students</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
