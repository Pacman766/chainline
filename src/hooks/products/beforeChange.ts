import { CollectionBeforeChangeHook } from 'payload';

export const beforeChange: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  if (operation === 'create' && !req.context?.isSeeding) {
    console.log(`[Products] ${operation}: ${data?.name}`);
    return {
      ...data,
      status: 'draft',
    };
  }
  return data;
};
