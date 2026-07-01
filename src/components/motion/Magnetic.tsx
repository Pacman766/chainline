'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

/** Maximum cursor-pull offset in pixels. Keep small — premium, not a jump. */
const MAX_OFFSET = 10;

const SPRING_CONFIG = { stiffness: 280, damping: 26 };

/**
 * Magnetic — wraps any element and subtly pulls it toward the cursor.
 * Springs back to origin on mouse-leave.
 * Under reduced-motion the translate is disabled (pos stays {0,0}).
 * Uses motion values + useSpring to avoid React re-renders on pointer move.
 *
 * Pass className to let the wrapper act as the styled element directly
 * (e.g. replace a div.feat-card with <Magnetic className="feat-card">).
 */
export function Magnetic({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const sx = useSpring(mvX, SPRING_CONFIG);
  const sy = useSpring(mvY, SPRING_CONFIG);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // Normalise to [-1, 1] relative to element half-size, then scale to max offset
    const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)));
    const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));
    mvX.set(nx * MAX_OFFSET);
    mvY.set(ny * MAX_OFFSET);
  };

  const onMouseLeave = () => {
    mvX.set(0);
    mvY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
