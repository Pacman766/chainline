'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import type { MotionValue, Transition } from 'motion/react';
import { useTranslations } from 'next-intl';

const entranceVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staticVariant = { opacity: 1, y: 0 };

// Heading words. Accent words (UP. / ON.) get the single springy overshoot.
const HEADING_WORDS: { text: string; cls?: string; accent?: boolean }[] = [
  { text: 'GEAR' },
  { text: 'UP.', cls: 'h-accent', accent: true },
  { text: 'RIDE' },
  { text: 'ON.', cls: 'h-outline', accent: true },
];

/**
 * RideWheel — inline SVG bike wheel (hub + spokes + rim) in chain-silver.
 * Rotation is driven by page scroll via the passed `rotate` MotionValue.
 * Built as a standalone element so a click handler can be attached later
 * (Phase 3 spin-to-reveal). Under reduced motion it renders static.
 */
function RideWheel({
  rotate,
  reduced,
}: {
  rotate: MotionValue<number>;
  reduced: boolean;
}) {
  const spokes = Array.from({ length: 12 }, (_, i) => (i * 360) / 12);

  return (
    <motion.div
      className="hero-wheel"
      style={reduced ? undefined : { rotate }}
      initial={reduced ? false : { opacity: 0, scale: 0.9 }}
      animate={reduced ? undefined : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 } as Transition}
    >
      <svg viewBox="0 0 200 200" fill="none" role="presentation">
        {/* faint trail / outer halo */}
        <circle cx="100" cy="100" r="97" stroke="var(--hero-wheel-faint)" strokeWidth="1" />
        {/* rim */}
        <circle cx="100" cy="100" r="90" stroke="var(--hero-wheel)" strokeWidth="2.5" />
        <circle cx="100" cy="100" r="82" stroke="var(--hero-wheel-faint)" strokeWidth="1" />
        {/* spokes */}
        <g stroke="var(--hero-wheel)" strokeWidth="1.5" strokeLinecap="round">
          {spokes.map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={100 + Math.cos(rad) * 16}
                y1={100 + Math.sin(rad) * 16}
                x2={100 + Math.cos(rad) * 80}
                y2={100 + Math.sin(rad) * 80}
              />
            );
          })}
        </g>
        {/* hub */}
        <circle cx="100" cy="100" r="16" stroke="var(--hero-wheel)" strokeWidth="2.5" />
        <circle cx="100" cy="100" r="4" fill="var(--hero-wheel)" />
      </svg>
    </motion.div>
  );
}

/**
 * Odometer — count-up number that rolls from 0 to `to` on first view.
 * Uses tabular-nums for a mechanical, non-jittery roll. Renders the final
 * value immediately under reduced motion.
 */
function Odometer({
  to,
  suffix,
  em,
  reduced,
}: {
  to: number;
  suffix?: string;
  em: string;
  reduced: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [value, setValue] = useState(reduced ? to : 0);

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return;
    }
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, reduced]);

  return (
    <span className="stat-val" ref={ref}>
      <span className="stat-num">
        {value}
        {suffix}
      </span>
      <em>{em}</em>
    </span>
  );
}

export function Hero() {
  const t = useTranslations('home');
  const reducedMotion = useReducedMotion();
  const reduced = !!reducedMotion;

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  // Scroll drives the wheel's rotation across the page.
  const wheelRotate = useTransform(scrollYProgress, [0, 1], [0, 540]);

  const makeEntrance = (delay: number) =>
    reduced
      ? { initial: staticVariant, animate: staticVariant }
      : {
          initial: 'hidden' as const,
          animate: 'visible' as const,
          variants: entranceVariants,
          transition: { duration: 0.5, ease: 'easeOut', delay } as Transition,
        };

  const lineTransition = (i: number, accent?: boolean): Transition =>
    accent
      ? { type: 'spring', stiffness: 420, damping: 13, delay: 0.25 + i * 0.09 }
      : { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.09 };

  return (
    <section className="home-hero" ref={sectionRef}>
      <div className="hero-grid-bg" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-left">
          <motion.div className="hero-eyebrow" {...makeEntrance(0)}>
            <span className="hero-dot" />
            <span>{t('eyebrow')}</span>
            <span className="hero-est">Est. 2020</span>
          </motion.div>

          <h1 className="hero-heading">
            {HEADING_WORDS.map((word, i) => (
              <span className="hero-line" key={word.text}>
                <motion.span
                  className={`hero-word${word.cls ? ` ${word.cls}` : ''}`}
                  initial={reduced ? false : { y: '110%' }}
                  animate={reduced ? undefined : { y: '0%' }}
                  transition={lineTransition(i, word.accent)}
                >
                  {word.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p className="hero-sub" {...makeEntrance(0.55)}>
            {t('subLine1')}
            <br />
            {t('subLine2')}
          </motion.p>

          <motion.div className="hero-cta" {...makeEntrance(0.65)}>
            <Link href="/products" className="cta-primary">
              {t('ctaCatalog')}
              <ArrowRight size={18} />
            </Link>
            <Link href="/admin" className="cta-ghost" target="_blank">
              {t('ctaAdmin')}
            </Link>
          </motion.div>
        </div>

        <div className="hero-deco" aria-hidden="true">
          <RideWheel rotate={wheelRotate} reduced={reduced} />
        </div>
      </div>

      <motion.div className="hero-stats" {...makeEntrance(0.75)}>
        <div className="hero-stat">
          <Odometer to={500} em="+" reduced={reduced} />
          <span className="stat-lbl">{t('statProducts')}</span>
        </div>
        <div className="stat-sep" />
        <div className="hero-stat">
          <Odometer to={10} suffix="K" em="+" reduced={reduced} />
          <span className="stat-lbl">{t('statClients')}</span>
        </div>
        <div className="stat-sep" />
        <div className="hero-stat">
          <Odometer to={5} em="★" reduced={reduced} />
          <span className="stat-lbl">{t('statRating')}</span>
        </div>
      </motion.div>
    </section>
  );
}
