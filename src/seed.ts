import 'dotenv/config';
import { getPayload } from 'payload';
import config from '../src/payload.config';

const products = [
  {
    name: 'Specialized Tarmac SL8 SW Di2',
    price: 599900,
    category: 'road',
    status: 'published' as const,
    inStock: true,
    images: [
      { url: '/bikes/specialized/tarmac-1.webp', alt: 'Specialized Tarmac SL8 — hero' },
      { url: '/bikes/specialized/tarmac-2.webp', alt: 'Specialized Tarmac SL8 — side' },
      { url: '/bikes/specialized/tarmac-3.webp', alt: 'Specialized Tarmac SL8 — detail' },
      { url: '/bikes/specialized/tarmac-4.webp', alt: 'Specialized Tarmac SL8 — rear' },
    ],
  },
  {
    name: 'Specialized Roubaix SW AXS',
    price: 449900,
    category: 'road',
    status: 'published' as const,
    inStock: true,
    images: [
      { url: '/bikes/specialized/roubaix-1.webp', alt: 'Specialized Roubaix — hero' },
      { url: '/bikes/specialized/roubaix-2.webp', alt: 'Specialized Roubaix — side' },
      { url: '/bikes/specialized/roubaix-3.webp', alt: 'Specialized Roubaix — detail' },
      { url: '/bikes/specialized/roubaix-4.webp', alt: 'Specialized Roubaix — cockpit' },
    ],
  },
  {
    name: 'Pinarello Dogma F',
    price: 899900,
    category: 'road',
    status: 'published' as const,
    inStock: true,
    images: [
      { url: '/bikes/pinarello/dogma-1.png', alt: 'Pinarello Dogma F — side' },
      { url: '/bikes/pinarello/dogma-2.png', alt: 'Pinarello Dogma F — detail' },
      { url: '/bikes/pinarello/dogma-3.png', alt: 'Pinarello Dogma F — front' },
    ],
  },
  {
    name: 'Canyon Grail CF SLX 8 Di2',
    price: 389900,
    category: 'gravel',
    status: 'published' as const,
    inStock: true,
    images: [
      { url: '/bikes/canyon/grail-1.avif', alt: 'Canyon Grail — full view' },
      { url: '/bikes/canyon/grail-2.avif', alt: 'Canyon Grail — alternate angle' },
      { url: '/bikes/canyon/grail-3.avif', alt: 'Canyon Grail — cockpit detail' },
      { url: '/bikes/canyon/grail-4.avif', alt: 'Canyon Grail — storage' },
    ],
  },
  {
    name: 'Canyon Grizl CF 6',
    price: 249900,
    category: 'touring',
    status: 'published' as const,
    inStock: true,
    images: [
      { url: '/bikes/canyon/grizl-1.avif', alt: 'Canyon Grizl — full view' },
      { url: '/bikes/canyon/grizl-2.avif', alt: 'Canyon Grizl — alternate' },
      { url: '/bikes/canyon/grizl-3.avif', alt: 'Canyon Grizl — rack detail' },
    ],
  },
  {
    name: 'Kona Sutra',
    price: 149900,
    category: 'touring',
    status: 'published' as const,
    inStock: false,
    images: [
      { url: '/bikes/kona/sutra-1.webp', alt: 'Kona Sutra — hero' },
      { url: '/bikes/kona/sutra-2.webp', alt: 'Kona Sutra — side' },
      { url: '/bikes/kona/sutra-3.webp', alt: 'Kona Sutra — detail' },
      { url: '/bikes/kona/sutra-4.webp', alt: 'Kona Sutra — front' },
    ],
  },
];

async function seed() {
  const payload = await getPayload({ config });

  const road = await payload.create({
    collection: 'categories',
    data: { name: 'Шоссейные', slug: 'road' },
    overrideAccess: true,
  });

  const gravel = await payload.create({
    collection: 'categories',
    data: { name: 'Гравел', slug: 'gravel' },
    overrideAccess: true,
  });

  const touring = await payload.create({
    collection: 'categories',
    data: { name: 'Туринг', slug: 'touring' },
    overrideAccess: true,
  });

  const categoryMap: Record<string, number> = {
    road: road.id,
    gravel: gravel.id,
    touring: touring.id,
  };

  for (const product of products) {
    await payload.create({
      collection: 'products',
      data: {
        ...product,
        category: categoryMap[product.category],
      },
      overrideAccess: true,
      context: { isSeeding: true },
    });
    console.log(`Created: ${product.name}`);
  }

  console.log('Seed complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
