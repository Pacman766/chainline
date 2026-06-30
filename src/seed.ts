import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { getPayload, Payload } from 'payload';
import config from '../src/payload.config';
import { categories, products, buildDescription } from './seed-data';

// Seeds write DATA only — never mutate schema. Force-disable Payload's dev
// schema push so running this against ANY database (including prod) can't
// trigger drizzle's interactive schema sync. Schema is owned by migrations.
// This runs before getPayload()/connect, which is where the flag is read.
// (db-postgres connect.js skips pushDevSchema when PAYLOAD_MIGRATING === 'true'.)
process.env.PAYLOAD_MIGRATING = 'true';

const MIME: Record<string, string> = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.avif': 'image/avif',
};

async function createMedia(payload: Payload, publicPath: string, alt: string) {
  const fullPath = path.join(process.cwd(), 'public', publicPath);
  const filename = path.basename(fullPath);

  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    overrideAccess: true,
  });
  if (docs[0]) return docs[0].id;

  const data = fs.readFileSync(fullPath);
  const mimetype = MIME[path.extname(filename).toLowerCase()] ?? 'image/jpeg';

  const media = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype, name: filename, size: data.length },
    overrideAccess: true,
  });
  return media.id;
}

async function seed() {
  const payload = await getPayload({ config });

  async function findOrCreateCategory(slug: string, name: string) {
    const { docs } = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    });
    if (docs[0]) return docs[0];
    return payload.create({ collection: 'categories', data: { name, slug }, overrideAccess: true });
  }

  const categoryMap: Record<string, number> = {};
  for (const { slug, name, en } of categories) {
    const cat = await findOrCreateCategory(slug, name);
    categoryMap[slug] = cat.id;
    // Always (re)write both locales so localized category names hold correct values.
    await payload.update({ collection: 'categories', id: cat.id, locale: 'ru', data: { name }, overrideAccess: true });
    await payload.update({ collection: 'categories', id: cat.id, locale: 'en', data: { name: en }, overrideAccess: true });
  }

  for (const product of products) {
    const imageIds: number[] = [];
    for (const { url, alt } of product.images) {
      imageIds.push(await createMedia(payload, url, alt));
    }

    // Match by price (non-localized, unique per product) so reseeding still
    // finds existing rows after localized name/description move to *_locales.
    const { docs: existing } = await payload.find({
      collection: 'products',
      where: { price: { equals: product.price } },
      limit: 1,
      overrideAccess: true,
    });

    let productId: number;
    if (existing[0]) {
      productId = existing[0].id;
    } else {
      const created = await payload.create({
        collection: 'products',
        data: {
          name: product.name,
          price: product.price,
          inStock: product.inStock,
          category: categoryMap[product.category],
          description: buildDescription(product.description),
          images: imageIds,
          _status: 'published',
        },
        draft: false,
        overrideAccess: true,
        context: { isSeeding: true },
      });
      productId = created.id;
    }

    // Always (re)write the default RU locale so existing rows hold correct Russian.
    await payload.update({
      collection: 'products',
      id: productId,
      locale: 'ru',
      data: {
        name: product.name,
        description: buildDescription(product.description),
      },
      overrideAccess: true,
      context: { isSeeding: true },
    });

    if (product.en) {
      await payload.update({
        collection: 'products',
        id: productId,
        locale: 'en',
        data: {
          name: product.name,
          description: buildDescription(product.en.description),
        },
        overrideAccess: true,
        context: { isSeeding: true },
      });
    }

    console.log(`Seeded (ru+en): ${product.name}`);
  }

  // Seed homepage global — RU locale first, then EN.
  // updateGlobal is naturally idempotent: re-running overwrites with the same data.
  //
  // IMPORTANT: Payload blocks have per-row IDs. Writing two separate locale passes
  // with bare blocks (no id) would create fresh rows on the second pass, orphaning
  // the first locale's data. The fix: write RU → read back IDs → pass IDs in EN
  // write so Payload updates the SAME rows in the EN locale store.
  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'ru',
    data: {
      blocks: [
        {
          blockType: 'feature-grid',
          items: [
            { icon: 'star', title: 'Профессиональное снаряжение', desc: 'Отборные велосипеды и комплектующие от ведущих мировых брендов.' },
            { icon: 'shield', title: 'Экспертная поддержка', desc: 'Наши специалисты помогут подобрать идеальное оборудование для вашего стиля езды.' },
            { icon: 'bolt', title: 'Быстрая доставка', desc: 'Отправляем заказы в день оформления. Доставка по всей Беларуси.' },
          ],
        },
        {
          blockType: 'cta',
          heading: 'Готовы ехать быстрее?',
          sub: 'Откройте каталог и найдите снаряжение мечты.',
          buttonLabel: 'Смотреть каталог',
          buttonHref: '/products',
        },
        {
          blockType: 'contacts',
          heading: 'Свяжитесь с нами',
          intro: 'Мы всегда рады помочь с выбором. Приходите в шоурум или пишите нам.',
        },
      ],
    },
    overrideAccess: true,
  });

  // Read back to obtain the block IDs Payload assigned above.
  const homepageRu = await payload.findGlobal({ slug: 'homepage', locale: 'ru', overrideAccess: true } as Parameters<typeof payload.findGlobal>[0]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ruBlocks: any[] = (homepageRu as any).blocks ?? [];
  const [ruFeatBlock, ruCtaBlock, ruContactsBlock] = ruBlocks;

  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'en',
    data: {
      blocks: [
        {
          id: ruFeatBlock?.id,
          blockType: 'feature-grid',
          items: (ruFeatBlock?.items ?? []).map((item: { id?: string | number }, idx: number) => {
            const enCopy = [
              { title: 'Professional Gear', desc: 'Curated bikes and components from the world\'s leading brands.' },
              { title: 'Expert Support', desc: 'Our specialists will help you find the perfect equipment for your riding style.' },
              { title: 'Fast Delivery', desc: 'Orders ship the same day. Delivery across Belarus.' },
            ][idx] ?? {};
            return { id: item.id, ...enCopy };
          }),
        },
        {
          id: ruCtaBlock?.id,
          blockType: 'cta',
          heading: 'Ready to ride faster?',
          sub: 'Browse the catalog and find your dream gear.',
          buttonLabel: 'Browse catalog',
          buttonHref: '/products',
        },
        {
          id: ruContactsBlock?.id,
          blockType: 'contacts',
          heading: 'Get in touch',
          intro: 'We\'re always happy to help you choose. Visit our showroom or reach out to us.',
        },
      ],
    },
    overrideAccess: true,
  });
  console.log('Seeded (ru+en): homepage global');

  const current = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true });
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      storeName: current.storeName ?? 'CHAINLINE',
      contact: {
        email: 'hello@chainline.cc',
        phone: '+375 29 123-45-67',
        address: 'Минск, ул. Велосипедная, 7\nБЦ «Пелотон», 2 этаж',
        workingHours: 'Пн–Пт: 10:00–20:00\nСб–Вс: 11:00–18:00',
      },
      socials: [
        { platform: 'telegram', url: 'https://t.me/chainline' },
        { platform: 'instagram', url: 'https://instagram.com/chainline' },
        { platform: 'youtube', url: 'https://youtube.com/@chainline' },
      ],
    },
    overrideAccess: true,
  });
  console.log('Seeded: site-settings contacts');

  console.log('Seed complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
