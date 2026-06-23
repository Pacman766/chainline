import { CollectionConfig } from 'payload';

/**
 * One-time email magic-link tokens. Only a sha256 HASH of the raw token is
 * stored — the raw token lives solely in the email link. All external access
 * is locked off; the API routes operate via `overrideAccess: true`.
 */
export const MagicTokens: CollectionConfig = {
  slug: 'magic-tokens',
  access: {
    create: () => false,
    read: () => false,
    update: () => false,
    delete: () => false,
  },
  admin: {
    hidden: true,
  },
  fields: [
    { name: 'email', type: 'text', required: true },
    { name: 'tokenHash', type: 'text', required: true, index: true },
    { name: 'expiresAt', type: 'date', required: true },
    { name: 'usedAt', type: 'date', required: false },
  ],
};
