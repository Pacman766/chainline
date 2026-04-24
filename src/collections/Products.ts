import { ALLOW_ALL, ONLY_ADMIN, ONLY_AUTHENTICATED, RESTRICTED_ALL } from '@/access';
import { beforeChange } from '@/hooks/products/beforeChange';
import { afterChange } from '@/hooks/products/afterChange';
import { CollectionConfig } from 'payload';
import { beforeDelete } from '@/hooks/products/beforeDelete';

export const Products: CollectionConfig = {
  slug: 'products',
  versions: {
    drafts: {
      autosave: false,
    },
    maxPerDoc: 10,
  },
  admin: {
    useAsTitle: 'name',
    preview: (doc) => {
      const base = process.env.NEXT_PUBLIC_API_URL ?? '';
      const secret = process.env.PREVIEW_SECRET ?? '';
      return `${base}/api/preview?secret=${secret}&id=${doc['id']}`;
    },
  },
  access: {
    read: ALLOW_ALL,
    create: ONLY_AUTHENTICATED,
    update: ONLY_AUTHENTICATED,
    delete: ONLY_ADMIN,
  },
  hooks: {
    beforeChange: [beforeChange],
    afterChange: [afterChange],
    beforeDelete: [beforeDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      max: 1000000,
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (value === null) return value;
            // Округлить до 2 знаков
            return Math.round(value * 100) / 100;
          },
        ],
        afterRead: [
          ({ value }) => value ?? 0, // null → 0
        ],
      },
    },
    {
      name: 'inStock',
      type: 'checkbox',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      label: 'Характеристики',
      type: 'collapsible',
      fields: [
        {
          name: 'dimensions',
          type: 'group',
          fields: [
            {
              name: 'weight',
              type: 'number',
              admin: {
                description: 'weight in gr',
              },
            },
            {
              name: 'width',
              type: 'number',
              admin: {
                description: 'width in cm',
              },
            },
            {
              name: 'height',
              type: 'number',
              admin: {
                description: 'Height in cm',
              },
            },
          ],
        },
        {
          name: 'images',
          type: 'relationship',
          relationTo: 'media',
          hasMany: true,
        },
      ],
    },
  ],
};
