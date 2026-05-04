import { getPayload } from 'payload';
import config from '@payload-config';
import { Order } from '@/payload-types';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

interface OrderItem {
  productId: number | string;
  quantity: number;
}

function validateItems(items: unknown): asserts items is OrderItem[] {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ValidationError('items must be a non-empty array');
  }
  for (const item of items) {
    if (typeof item !== 'object' || item === null) {
      throw new ValidationError('Each item must be an object');
    }
    const { productId, quantity } = item as Record<string, unknown>;
    const id = Number(productId);
    if (!Number.isFinite(id) || !Number.isInteger(id) || id <= 0) {
      throw new ValidationError('Each item must have a valid productId (positive integer)');
    }
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity <= 0) {
      throw new ValidationError('Each item must have a valid quantity (positive integer)');
    }
  }
}

export async function createOrder(items: OrderItem[], customerId: number): Promise<Order> {
  validateItems(items);

  const payload = await getPayload({ config });

  const resolvedItems = await Promise.all(
    items.map(async (item) => {
      const numericId = Number(item.productId);
      let product;
      try {
        product = await payload.findByID({
          collection: 'products',
          id: numericId,
        });
      } catch {
        throw new ValidationError(`Product not found: ${item.productId}`);
      }

      if (!product) {
        throw new ValidationError(`Product not found: ${item.productId}`);
      }

      return {
        product: numericId,
        quantity: item.quantity,
        price: product.price,
      };
    }),
  );

  const total = resolvedItems.reduce((acc, item) => acc + (item.price ?? 0) * item.quantity, 0);

  const order = await payload.create({
    collection: 'orders',
    data: {
      items: resolvedItems,
      customer: customerId,
      total,
      status: 'pending',
    },
  });

  return order;
}
