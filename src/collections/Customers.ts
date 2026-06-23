import { CollectionConfig } from 'payload';

export const Customers: CollectionConfig = {
  slug: 'customers',
  auth: {
    // Stateless JWT bearer: no server-side session record, so a valid token
    // can be minted (magic link / OAuth) without writing a session row.
    // getAuthenticatedUser uses `Authorization: JWT <token>` against this.
    useSessions: false,
    // 7 days — keep password-login tokens in lockstep with issueCustomerToken.
    tokenExpiration: 60 * 60 * 24 * 7,
  },
  access: {
    create: () => true,
  },
  fields: [
    { name: 'firstName', type: 'text' },
    { name: 'lastName', type: 'text' },
  ],
};
