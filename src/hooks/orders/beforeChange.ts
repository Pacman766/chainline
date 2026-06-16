import { Order } from '@/payload-types';
import { CollectionBeforeChangeHook } from 'payload';

type OrderItem = NonNullable<Order['items']>[number]

export const beforeChange: CollectionBeforeChangeHook = async ({ data, operation }) => {
  if (operation !== 'create') return data;

  data.total = (data.items ?? []).reduce(
    (sum: number, item: OrderItem) => sum + (item.price ?? 0) * (item.quantity ?? 0),
    0,
  );

  return data;
};
