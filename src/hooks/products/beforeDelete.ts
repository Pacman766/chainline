import { APIError, CollectionBeforeDeleteHook } from 'payload';

export const beforeDelete: CollectionBeforeDeleteHook = async ({ id, req: { payload } }) => {
  const orders = await payload.find({
    collection: 'orders',
    where: { 'items.product': { equals: id } },
  });
  if (orders.totalDocs > 0) {
    throw new APIError(
      'Нельзя удалить товар с активными заказами',
      400,
      undefined,
      true /* isPublic */,
    );
  }
};
