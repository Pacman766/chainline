'use client';

import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

/** Maximum cursor-pull offset in pixels. Keep small — premium, not a jump. */
const MAX_OFFSET = 10;

/**
 * Magnetic — wraps any element and subtly pulls it toward the cursor.
 * Springs back to origin on mouse-leave.
 * Under reduced-motion the translate is disabled (pos stays {0,0}).
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
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduced = !!useReducedMotion();

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // Normalise to [-1, 1] relative to element half-size, then scale to max offset
    const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)));
    const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));
    setPos({ x: nx * MAX_OFFSET, y: ny * MAX_OFFSET });
  };

  const onMouseLeave = () => setPos({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={
        reduced
          ? { duration: 0 }
          : { type: 'spring', stiffness: 280, damping: 26 }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
