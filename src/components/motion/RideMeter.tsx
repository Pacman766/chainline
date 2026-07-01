'use client';

import { motion, useScroll } from 'motion/react';

/**
 * RideMeter — thin fixed progress bar at the very top of the viewport.
 * Acts as a "speedometer" of page scroll. Scroll position is informational,
 * not decorative, so the bar always shows (no reduced-motion gating).
 * scaleX is used (transform-only) for performance. No spring/easing — the
 * MotionValue is bound directly, satisfying the reduced-motion no-spring rule.
 */
export function RideMeter() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="ride-meter-track" aria-hidden="true">
      <motion.div className="ride-meter-bar" style={{ scaleX: scrollYProgress }} />
    </div>
  );
}
