import { useEffect } from 'react';

/**
 * Custom hook to initialize IntersectionObserver for smooth scroll-reveal animations.
 * Observes elements with '.pv-scroll-reveal' or 'data-scroll-reveal'.
 * When an element enters the viewport, adds 'pv-revealed' class once.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    // Respect user's motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.pv-scroll-reveal, .pv-scroll-reveal-scale, [data-scroll-reveal], .pv-reveal-group, .pv-reveal-card').forEach((el) => {
        el.classList.add('pv-revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('pv-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
      }
    );

    const observeElements = () => {
      // 1. Auto-tag major sections across all pages if not yet tagged (Requirement 4)
      const autoSectionCandidates = document.querySelectorAll(
        'main > div > section:not(.pv-hero-original-container):not(.pv-scroll-reveal):not(.pv-revealed), ' +
        'main > section:not(.pv-hero-original-container):not(.pv-scroll-reveal):not(.pv-revealed), ' +
        '.prma-portal-wrap section:not(.pv-scroll-reveal):not(.pv-revealed)'
      );
      autoSectionCandidates.forEach((sec) => {
        sec.classList.add('pv-scroll-reveal');
      });

      // 2. Observe all elements with reveal classes
      const selector = '.pv-scroll-reveal:not(.pv-revealed), .pv-scroll-reveal-scale:not(.pv-revealed), [data-scroll-reveal]:not(.pv-revealed), .pv-reveal-group:not(.pv-revealed), .pv-reveal-card:not(.pv-revealed)';
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => observer.observe(el));
    };

    observeElements();

    // Re-check when route changes or DOM mutates
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}

export default useScrollReveal;
