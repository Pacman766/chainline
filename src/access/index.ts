import type { PayloadRequest } from 'payload';

export const ONLY_AUTHENTICATED = ({ req }: { req: PayloadRequest }) => !!req.user;
export const ONLY_ADMIN = ({ req }: { req: PayloadRequest }) => req.user?.collection === 'users';
export const ALLOW_ALL = () => true;
export const RESTRICTED_ALL = () => false;
