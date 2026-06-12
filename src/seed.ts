import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { getPayload, Payload } from 'payload';
import config from '../src/payload.config';
import { categories, products, buildDescription } from './seed-data';

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
  for (const { slug, name } of categories) {
    const cat = await findOrCreateCategory(slug, name);
    categoryMap[slug] = cat.id;
  }

  for (const product of products) {
    const imageIds: number[] = [];
    for (const { url, alt } of product.images) {
      imageIds.push(await createMedia(payload, url, alt));
    }

    await payload.create({
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
    console.log(`Created: ${product.name}`);
  }

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
