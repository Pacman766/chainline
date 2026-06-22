import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@payload-config';
import { getTranslations } from 'next-intl/server';
import { ArrowRight, Zap, ShieldCheck, Headphones } from 'lucide-react';

export default async function HomePage() {
  const payload = await getPayload({ config });
  const settings = await payload.findGlobal({ slug: 'site-settings' });
  const t = await getTranslations('home');

  return (
    <>
      {settings.showBanner && settings.bannerText && (
        <div className="home-banner">{settings.bannerText}</div>
      )}

      <section className="home-hero">
        <div className="hero-grid-bg" aria-hidden="true" />

        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="hero-dot" />
              <span>{t('eyebrow')}</span>
              <span className="hero-est">Est. 2020</span>
            </div>

            <h1 className="hero-heading">
              <span>GEAR</span>
              <span className="h-accent">UP.</span>
              <span>RIDE</span>
              <span className="h-outline">ON.</span>
            </h1>

            <p className="hero-sub">
              {t('subLine1')}
              <br />
              {t('subLine2')}
            </p>

            <div className="hero-cta">
              <Link href="/products" className="cta-primary">
                {t('ctaCatalog')}
                <ArrowRight size={18} />
              </Link>
              <Link href="/admin" className="cta-ghost" target="_blank">
                {t('ctaAdmin')}
              </Link>
            </div>
          </div>

          <div className="hero-deco" aria-hidden="true">
            <span className="deco-word">CHAINLINE</span>
            <span className="deco-ring" />
          </div>
        </div>

        <div className="hero-stats">
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
        </div>
      </section>

      <section className="home-features">
        <div className="feat-card">
          <span className="feat-num">01</span>
          <Zap size={26} className="feat-icon" />
          <h3>{t('feat1Title')}</h3>
          <p>{t('feat1Desc')}</p>
        </div>
        <div className="feat-card">
          <span className="feat-num">02</span>
          <ShieldCheck size={26} className="feat-icon" />
          <h3>{t('feat2Title')}</h3>
          <p>{t('feat2Desc')}</p>
        </div>
        <div className="feat-card">
          <span className="feat-num">03</span>
          <Headphones size={26} className="feat-icon" />
          <h3>{t('feat3Title')}</h3>
          <p>{t('feat3Desc')}</p>
        </div>
      </section>
    </>
  );
}
