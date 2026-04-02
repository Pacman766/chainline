import { CollectionAfterLoginHook } from 'payload';

export const afterLogin: CollectionAfterLoginHook = async ({ doc, req: { payload } }) => {
  // doc — это пользователь который залогинился
  payload.logger.info(`Customer logged in: ${doc.email}`);
  return doc;
};
