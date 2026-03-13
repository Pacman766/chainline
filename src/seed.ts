import 'dotenv/config';
import { getPayload } from 'payload';
import config from '../src/payload.config';

const products = [
  {
    name: 'MacBook Pro 14"',
    price: 199999,
    category: 'electronics',
    status: 'published' as const,
    inStock: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
        alt: 'MacBook Pro',
      },
    ],
  },
  {
    name: 'iPhone 15 Pro',
    price: 129999,
    category: 'electronics',
    status: 'published' as const,
    inStock: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600', alt: 'iPhone' },
    ],
  },
  {
    name: 'Nike Air Max 90',
    price: 12999,
    category: 'clothing',
    status: 'published' as const,
    inStock: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
        alt: 'Nike Air Max',
      },
    ],
  },
  {
    name: "Levi's 501 Jeans",
    price: 8999,
    category: 'clothing',
    status: 'draft' as const,
    inStock: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', alt: 'Jeans' },
    ],
  },
  {
    name: 'Organic Coffee Beans 1kg',
    price: 1499,
    category: 'food',
    status: 'published' as const,
    inStock: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600',
        alt: 'Coffee beans',
      },
    ],
  },
];

async function seed() {
  const payload = await getPayload({ config });

  const electronics = await payload.create({
    collection: 'categories',
    data: { name: 'Электроника', slug: 'electronics' },
    overrideAccess: true,
  });

  const clothing = await payload.create({
    collection: 'categories',
    data: { name: 'Одежда', slug: 'clothing' },
    overrideAccess: true,
  });

  const food = await payload.create({
    collection: 'categories',
    data: { name: 'Еда', slug: 'food' },
    overrideAccess: true,
  });

  const categoryMap: Record<string, number> = {
    electronics: electronics.id,
    clothing: clothing.id,
    food: food.id,
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
