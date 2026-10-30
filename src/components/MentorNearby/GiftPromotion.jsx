import React, { useState, useEffect } from 'react';
import GiftBox3D from './GiftBox3D';
import GiftLabel from './GiftLabel';
import AnimatedArrow from './AnimatedArrow';
import MentorNearbyModal from './MentorNearbyModal';

/**
 * GiftPromotion — Coordinating Container Component
 * Matches Reference Image 1 & 2:
 * - Coordinates GiftLabel, AnimatedArrow, and GiftBox3D
 * - Handles one-time interaction state via localStorage ('pv_mentornearby_gift_interacted')
 * - When interacted, suppresses the arrow and instructional text on subsequent visits
 * - Opens centered MentorNearbyModal on click
 * - Preserves responsiveness across desktop, tablet, and mobile
 */
export default function GiftPromotion({ className = '', style = {}, isMobile = false }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    try {
      const interacted = localStorage.getItem('pv_mentornearby_gift_interacted');
      if (interacted === 'true') {
        setHasInteracted(true);
      }
    } catch {
      // Ignore private mode access errors
    }
  }, []);

  const handleOpenGift = () => {
    setIsModalOpen(true);
    setHasInteracted(true);
    try {
      localStorage.setItem('pv_mentornearby_gift_interacted', 'true');
    } catch {
      // Ignore storage errors
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Mobile compact layout
  if (isMobile) {
    return (
      <div
        className={`pv-gift-promotion-mobile-wrapper ${className}`}
        onClick={handleOpenGift}
        role="button"
        tabIndex={0}
        aria-label="Open Gift — Tutor Registration Promotion"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpenGift();
          }
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          userSelect: 'none',
          cursor: 'pointer',
          ...style
        }}
      >
        {/* Mobile Promo Header */}
        <div style={{ marginBottom: '4px', transform: 'scale(0.88)' }}>
          <GiftLabel onClick={handleOpenGift} />
        </div>

        {/* Mobile Compact 3D Gift */}
        <div
          style={{
            transform: 'scale(0.78)',
            transformOrigin: 'center top',
            cursor: 'pointer',
            height: '145px'
          }}
        >
          <GiftBox3D onClick={handleOpenGift} isHovered={isHovered} />
        </div>

        {/* Modal Portal */}
        <MentorNearbyModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    );
  }

  // Desktop layout (Matches Reference Image 1)
  return (
    <div
      className={`pv-gift-promotion-desktop-wrapper ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none',
        ...style
      }}
    >
      {/* =======================================================================
          TOP-LEFT PROMOTIONAL LABEL & CURVED ARROW (Matches Reference Image 1)
          ======================================================================= */}
      <div
        style={{
          position: 'absolute',
          top: '-48px',
          left: '-38px',
          zIndex: 18,
          display: 'flex',
          alignItems: 'flex-start'
        }}
      >
        {/* Promotional Pill Badge */}
        <GiftLabel onClick={handleOpenGift} />

        {/* Curved Burgundy & Golden Arrow (Suppressed once user has interacted) */}
        {!hasInteracted && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: 'calc(100% - 22px)',
              zIndex: 19,
              pointerEvents: 'none'
            }}
          >
            <AnimatedArrow />
          </div>
        )}
      </div>

      {/* =======================================================================
          3D BURGUNDY & METALLIC GOLD GIFT BOX
          ======================================================================= */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          marginTop: '16px'
        }}
      >
        <GiftBox3D onClick={handleOpenGift} isHovered={isHovered} />
      </div>

      {/* Modal Portal */}
      <MentorNearbyModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
