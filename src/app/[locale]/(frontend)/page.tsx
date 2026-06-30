import { getPayload } from 'payload';
import config from '@payload-config';
import { BlocksRenderer } from '@/components/blocks/BlocksRenderer';
import { Hero } from '@/components/Hero';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: 'ru' | 'en' }>;
}) {
  const { locale } = await params;
  const payload = await getPayload({ config });
  const [settings, homepage] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings' }),
    payload.findGlobal({ slug: 'homepage', locale }).catch(() => null),
  ]);

  const blocks = homepage?.blocks ?? [];

  return (
    <>
      {settings.showBanner && settings.bannerText && (
        <div className="home-banner">{settings.bannerText}</div>
      )}

      <Hero />

      <BlocksRenderer blocks={blocks} />
    </>
  );
}
