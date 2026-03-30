import { GlobalConfig } from 'payload';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  fields: [
    { name: 'storeName', type: 'text', required: true },
    { name: 'contactEmail', type: 'email' },
    { name: 'bannerText', type: 'text' },
    { name: 'showBanner', type: 'checkbox' },
  ],
};
