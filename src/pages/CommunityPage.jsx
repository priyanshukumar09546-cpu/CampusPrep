import React, { useEffect } from 'react';

/**
 * Community feature has been completely retired.
 * Clean fallback redirection to Home.
 */
export default function CommunityPage({ onNavigate }) {
  useEffect(() => {
    if (onNavigate) {
      onNavigate('home');
    }
  }, [onNavigate]);

  return null;
}
