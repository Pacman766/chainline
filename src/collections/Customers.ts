import { CollectionConfig } from 'payload';

export const Customers: CollectionConfig = {
  slug: 'customers',
  auth: true,
  access: {
    create: () => true,
  },
  fields: [
    { name: 'firstName', type: 'text' },
    { name: 'lastName', type: 'text' },
  ],
};
