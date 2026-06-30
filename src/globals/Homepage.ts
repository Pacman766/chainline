import { GlobalConfig } from 'payload';

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  fields: [
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'feature-grid',
          fields: [
            {
              name: 'items',
              type: 'array',
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  options: [
                    { label: 'Star', value: 'star' },
                    { label: 'Check', value: 'check' },
                    { label: 'Bolt', value: 'bolt' },
                    { label: 'Heart', value: 'heart' },
                    { label: 'Shield', value: 'shield' },
                    { label: 'Globe', value: 'globe' },
                  ],
                },
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'desc',
                  type: 'textarea',
                  localized: true,
                },
              ],
            },
          ],
        },
        {
          slug: 'cta',
          fields: [
            {
              name: 'heading',
              type: 'text',
              localized: true,
            },
            {
              name: 'sub',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'buttonLabel',
              type: 'text',
              localized: true,
            },
            {
              name: 'buttonHref',
              type: 'text',
            },
          ],
        },
        {
          slug: 'contacts',
          fields: [
            {
              name: 'heading',
              type: 'text',
              localized: true,
            },
            {
              name: 'intro',
              type: 'textarea',
              localized: true,
            },
          ],
        },
      ],
    },
  ],
};
