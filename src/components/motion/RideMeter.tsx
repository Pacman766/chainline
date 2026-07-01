'use client';

import { motion, useReducedMotion, useScroll } from 'motion/react';

/**
 * RideMeter — thin fixed progress bar at the very top of the viewport.
 * Acts as a "speedometer" of page scroll. Under reduced motion the bar is
 * hidden entirely (no animation, no scroll tracking).
 * scaleX is used (transform-only) for performance. No spring/easing — the
 * MotionValue is bound directly.
 */
export function RideMeter() {
  const { scrollYProgress } = useScroll();
  const reduced = !!useReducedMotion();

  return (
    <div className="ride-meter-track" aria-hidden="true">
      {!reduced && (
        <motion.div className="ride-meter-bar" style={{ scaleX: scrollYProgress }} />
      )}
    </div>
  );
}
