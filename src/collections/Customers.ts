import { CollectionConfig } from 'payload';
import { afterLogin } from '@/hooks/afterLogin';

export const Customers: CollectionConfig = {
  slug: 'customers',
  auth: true,
  access: {
    create: () => true,
  },
  hooks: {
    afterLogin: [afterLogin],
  },
  fields: [
    { name: 'firstName', type: 'text' },
    { name: 'lastName', type: 'text' },
  ],
};
