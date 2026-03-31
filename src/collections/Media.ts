import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    staticDir: '../public/media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: undefined, // undefined = сохранить пропорции
      },
      {
        name: 'hero',
        width: 1920,
        height: undefined,
      },
    ],
    adminThumbnail: 'thumbnail', // какой размер показывать в админке
    mimeTypes: ['image/*'], // разрешённые типы
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
};
