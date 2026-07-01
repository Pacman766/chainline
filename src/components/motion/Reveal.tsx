'use client';

import { motion, useReducedMotion } from 'motion/react';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Reveal — animates children into view with a fade + upward slide.
 *
 * Uses `whileInView` with `once: true` so the animation runs only once.
 * When prefers-reduced-motion is set the children render immediately
 * in their final/visible state without any transform.
 *
 * Children are passed through as-is so the wrapped content can remain
 * server-rendered (RSC boundary is not crossed by Reveal itself).
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-64px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}
