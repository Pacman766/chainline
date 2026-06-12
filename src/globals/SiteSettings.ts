import { GlobalConfig } from 'payload';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  fields: [
    { name: 'storeName', type: 'text', required: true },
    { name: 'bannerText', type: 'text' },
    { name: 'showBanner', type: 'checkbox' },
    {
      name: 'contact',
      type: 'group',
      label: 'Контакты',
      fields: [
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text' },
        { name: 'address', type: 'textarea' },
        { name: 'workingHours', type: 'textarea', label: 'Часы работы' },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      label: 'Соцсети',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Telegram', value: 'telegram' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'VK', value: 'vk' },
            { label: 'X / Twitter', value: 'x' },
            { label: 'Facebook', value: 'facebook' },
          ],
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
};
