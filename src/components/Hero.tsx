'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { Transition } from 'motion/react';
import { useTranslations } from 'next-intl';

const entranceVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staticVariant = { opacity: 1, y: 0 };

export function Hero() {
  const t = useTranslations('home');
  const reducedMotion = useReducedMotion();

  const makeEntrance = (delay: number) =>
    reducedMotion
      ? { initial: staticVariant, animate: staticVariant }
      : {
          initial: 'hidden' as const,
          animate: 'visible' as const,
          variants: entranceVariants,
          transition: { duration: 0.5, ease: 'easeOut', delay } as Transition,
        };

  const ambientAnimation = reducedMotion
    ? {}
    : {
        animate: { rotate: 360 },
        transition: { repeat: Infinity, duration: 24, ease: 'linear' } as Transition,
      };

  const decoWordAnimation = reducedMotion
    ? {}
    : {
        animate: { opacity: [0.15, 0.3, 0.15] },
        transition: { repeat: Infinity, duration: 6, ease: 'easeInOut' } as Transition,
      };

  return (
    <section className="home-hero">
      <div className="hero-grid-bg" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-left">
          <motion.div className="hero-eyebrow" {...makeEntrance(0)}>
            <span className="hero-dot" />
            <span>{t('eyebrow')}</span>
            <span className="hero-est">Est. 2020</span>
          </motion.div>

          <motion.h1 className="hero-heading" {...makeEntrance(0.1)}>
            <span>GEAR</span>
            <span className="h-accent">UP.</span>
            <span>RIDE</span>
            <span className="h-outline">ON.</span>
          </motion.h1>

          <motion.p className="hero-sub" {...makeEntrance(0.2)}>
            {t('subLine1')}
            <br />
            {t('subLine2')}
          </motion.p>

          <motion.div className="hero-cta" {...makeEntrance(0.3)}>
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
          <motion.span
            className="deco-word"
            {...decoWordAnimation}
          >
            CHAINLINE
          </motion.span>
          <motion.span
            className="deco-ring"
            {...ambientAnimation}
          />
        </div>
      </div>

      <motion.div className="hero-stats" {...makeEntrance(0.45)}>
        <div className="hero-stat">
          <span className="stat-val">500<em>+</em></span>
          <span className="stat-lbl">{t('statProducts')}</span>
        </div>
        <div className="stat-sep" />
        <div className="hero-stat">
          <span className="stat-val">10K<em>+</em></span>
          <span className="stat-lbl">{t('statClients')}</span>
        </div>
        <div className="stat-sep" />
        <div className="hero-stat">
          <span className="stat-val">5<em>★</em></span>
          <span className="stat-lbl">{t('statRating')}</span>
        </div>
      </motion.div>
    </section>
  );
}
