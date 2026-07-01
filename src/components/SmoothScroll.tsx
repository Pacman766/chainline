'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * SmoothScroll — mounts Lenis smooth-scroll and drives its RAF loop.
 *
 * Skipped (native scroll fallback) when:
 *   - prefers-reduced-motion: reduce is set
 *   - coarse pointer (touch device) or viewport width < 1024 px (mobile/tablet)
 */
export function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const smallViewport = window.innerWidth < 1024;

    if (prefersReduced || coarsePointer || smallViewport) {
      return;
    }

    const lenis = new Lenis();

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
