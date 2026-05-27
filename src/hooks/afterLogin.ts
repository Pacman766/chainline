import { CollectionAfterLoginHook } from 'payload';

export const afterLogin: CollectionAfterLoginHook = async ({ user, req: { payload } }) => {
  payload.logger.info(`Customer logged in: ${user.email}`);
  return user;
};
