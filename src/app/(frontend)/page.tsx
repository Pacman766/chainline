import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getPayload } from 'payload';
import config from '@payload-config';
import { ArrowRight } from 'lucide-react';

export default async function HomePage() {
  const payload = await getPayload({ config });
  const settings = await payload.findGlobal({ slug: 'site-settings' });

  return (
    <>
      {/* Hero */}
      <section className="bg-zinc-50 border-b">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-32">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-widest uppercase text-orange-600 mb-4">
              Premium Cycling
            </p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
              Gear up.
              <br />
              Ride on.
            </h1>
            <p className="text-muted-foreground text-lg max-w-sm mb-8">
              Велосипеды и комплектующие для тех, кто едет быстрее.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild className="gap-2">
                <Link href="/products">
                  Смотреть каталог
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/admin" target="_blank">
                  Админ панель
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Banner */}
      {settings.showBanner && settings.bannerText && (
        <div className="bg-orange-50 border-b border-orange-100 text-orange-900 py-3 text-center text-sm font-medium">
          {settings.bannerText}
        </div>
      )}
    </>
  );
}
