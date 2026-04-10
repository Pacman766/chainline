import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@payload-config';
import { ArrowRight, Zap, ShieldCheck, Headphones } from 'lucide-react';

export default async function HomePage() {
  const payload = await getPayload({ config });
  const settings = await payload.findGlobal({ slug: 'site-settings' });

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
              <span>Premium Cycling Equipment</span>
              <span className="hero-est">Est. 2020</span>
            </div>

            <h1 className="hero-heading">
              <span>GEAR</span>
              <span className="h-accent">UP.</span>
              <span>RIDE</span>
              <span className="h-outline">ON.</span>
            </h1>

            <p className="hero-sub">
              Велосипеды и комплектующие
              <br />
              для тех, кто едет быстрее.
            </p>

            <div className="hero-cta">
              <Link href="/products" className="cta-primary">
                Смотреть каталог
                <ArrowRight size={18} />
              </Link>
              <Link href="/admin" className="cta-ghost" target="_blank">
                Админ панель
              </Link>
            </div>
          </div>

          <div className="hero-deco" aria-hidden="true">
            <span className="deco-word">CADENCE</span>
            <span className="deco-ring" />
          </div>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="stat-val">500<em>+</em></span>
            <span className="stat-lbl">Товаров в каталоге</span>
          </div>
          <div className="stat-sep" />
          <div className="hero-stat">
            <span className="stat-val">10K<em>+</em></span>
            <span className="stat-lbl">Довольных клиентов</span>
          </div>
          <div className="stat-sep" />
          <div className="hero-stat">
            <span className="stat-val">5<em>★</em></span>
            <span className="stat-lbl">Средний рейтинг</span>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="feat-card">
          <span className="feat-num">01</span>
          <Zap size={26} className="feat-icon" />
          <h3>Быстрая доставка</h3>
          <p>Отправляем заказы в течение 24 часов. Доставка по всей России за 2–5 дней.</p>
        </div>
        <div className="feat-card">
          <span className="feat-num">02</span>
          <ShieldCheck size={26} className="feat-icon" />
          <h3>Гарантия качества</h3>
          <p>Только оригинальные комплектующие от ведущих мировых производителей.</p>
        </div>
        <div className="feat-card">
          <span className="feat-num">03</span>
          <Headphones size={26} className="feat-icon" />
          <h3>Поддержка экспертов</h3>
          <p>Консультации от профессиональных гонщиков и механиков 7 дней в неделю.</p>
        </div>
      </section>
    </>
  );
}
