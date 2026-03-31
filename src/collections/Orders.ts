import { afterChange } from '@/hooks/orders/afterChange';
import { CollectionConfig } from 'payload';

export const Orders: CollectionConfig = {
  slug: 'orders',
  fields: [
    { name: 'customer', type: 'relationship', relationTo: 'customers' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products' },
        { name: 'quantity', type: 'number' },
        { name: 'price', type: 'number' },
      ],
    },
    { name: 'total', type: 'number' },
    { name: 'status', type: 'select', options: ['pending', 'paid', 'shipped', 'cancelled'] },
  ],
  access: {
    read: ({ req }) => {
      if (req.user) return { customer: { equals: req.user.id } };
      return false;
    },
  },
  hooks: {
    afterChange: [afterChange],
  },
};
