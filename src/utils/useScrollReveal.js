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
      document.querySelectorAll('.pv-scroll-reveal, [data-scroll-reveal]').forEach((el) => {
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
        threshold: 0.12
      }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll('.pv-scroll-reveal:not(.pv-revealed), [data-scroll-reveal]:not(.pv-revealed)');
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
