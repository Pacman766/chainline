import { sqliteAdapter } from '@payloadcms/db-sqlite';
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

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Products } from './collections/Products';
import { Categories } from './collections/Categories';
import { Customers } from './collections/Customers';
import { Orders } from './collections/Orders';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Products, Categories, Customers, Orders],
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
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
});
