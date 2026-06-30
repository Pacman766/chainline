import { postgresAdapter } from '@payloadcms/db-postgres';
import {
  BoldFeature,
  ItalicFeature,
  lexicalEditor,
  OrderedListFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { searchPlugin } from '@payloadcms/plugin-search';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { resendAdapter } from '@payloadcms/email-resend';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Products } from './collections/Products';
import { Categories } from './collections/Categories';
import { Customers } from './collections/Customers';
import { MagicTokens } from './collections/MagicTokens';
import { Orders } from './collections/Orders';
import { SiteSettings } from './globals/SiteSettings';
import { Homepage } from './globals/Homepage';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  email: resendAdapter({
    defaultFromAddress: 'onboarding@resend.dev',
    defaultFromName: 'Payload Store',
    apiKey: process.env.RESEND_API_KEY ?? '',
  }),
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Products, Categories, Customers, MagicTokens, Orders],
  globals: [SiteSettings, Homepage],
  editor: lexicalEditor({
    features: [BoldFeature(), ItalicFeature(), UnorderedListFeature(), OrderedListFeature()],
  }),
  secret:
    process.env.PAYLOAD_SECRET ||
    (() => {
      throw new Error('PAYLOAD_SECRET is not set');
    })(),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: true,
      token: process.env.BLOB_READ_WRITE_TOKEN ?? '',
      collections: {
        media: true,
      },
    }),
    searchPlugin({
      collections: ['products'],
      defaultPriorities: {
        products: 10,
      },
      beforeSync: async ({ originalDoc, payload, searchDoc }) => {
        // Сериализовать Lexical rich text description → plain text
        let descriptionText = '';
        try {
          const root = originalDoc?.description?.root;
          if (root?.children) {
            descriptionText = (root.children as { children?: { type: string; text?: string }[] }[])
              .flatMap((node) => node.children ?? [])
              .filter((node) => node.type === 'text')
              .map((node) => node.text ?? '')
              .join(' ');
          }
        } catch {
          descriptionText = '';
        }

        // Вытащить category.name — при reindex depth:0, поэтому category может быть просто ID.
        // Используем payload.findByID чтобы получить имя в обоих случаях.
        let categoryName = '';
        const rawCategory = originalDoc?.category;
        if (typeof rawCategory === 'object' && rawCategory !== null) {
          categoryName = rawCategory.name ?? '';
        } else if (rawCategory != null) {
          try {
            const cat = await payload.findByID({ collection: 'categories', id: rawCategory });
            categoryName = cat?.name ?? '';
          } catch {
            categoryName = '';
          }
        }

        return {
          ...searchDoc,
          title: originalDoc?.name ?? searchDoc.title,
          meta: {
            description: descriptionText.toLowerCase(),
            categoryName: categoryName.toLowerCase(),
            titleSearch: (originalDoc?.name ?? '').toLowerCase(),
          },
        };
      },
      searchOverrides: {
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: 'meta',
            type: 'group',
            fields: [
              { name: 'name', type: 'text', localized: true },
              { name: 'description', type: 'richText', localized: true },
              {
                name: 'categoryName',
                type: 'text',
              },
              {
                name: 'titleSearch',
                type: 'text',
              },
            ],
          },
        ],
      },
    }),
  ],
  localization: {
    locales: ['ru', 'en'],
    defaultLocale: 'ru',
    fallback: true,
  },
});
