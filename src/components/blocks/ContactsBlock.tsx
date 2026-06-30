import { getPayload } from 'payload';
import config from '@payload-config';
import { getTranslations } from 'next-intl/server';
import type { Homepage } from '@/payload-types';

type ContactsBlockData = Extract<
  NonNullable<Homepage['blocks']>[number],
  { blockType: 'contacts' }
>;

const SOCIAL_LABELS: Record<string, string> = {
  telegram: 'Telegram',
  instagram: 'Instagram',
  youtube: 'YouTube',
  vk: 'VK',
  x: 'X / Twitter',
  facebook: 'Facebook',
};

export async function ContactsBlock({ block }: { block: ContactsBlockData }) {
  const payload = await getPayload({ config });
  const settings = await payload.findGlobal({ slug: 'site-settings' });
  const t = await getTranslations('contacts');

  const { email, phone, address, workingHours } = settings.contact ?? {};
  const socials = settings.socials ?? [];

  const channels = [
    email && { label: 'Email', value: email, href: `mailto:${email}`, mono: false },
    phone && {
      label: t('phone'),
      value: phone,
      href: `tel:${phone.replace(/[^+\d]/g, '')}`,
      mono: true,
    },
    workingHours && { label: t('workingHours'), value: workingHours, href: null, mono: false },
    address && {
      label: t('address'),
      value: address,
      href: `https://maps.google.com/?q=${encodeURIComponent(address)}`,
      hrefLabel: t('route'),
      mono: false,
    },
  ].filter(Boolean) as {
    label: string;
    value: string;
    href: string | null;
    hrefLabel?: string;
    mono: boolean;
  }[];

  const hasContent = block.heading || block.intro || channels.length > 0 || socials.length > 0;
  if (!hasContent) return null;

  return (
    <section className="home-contacts-block">
      {(block.heading || block.intro) && (
        <div className="home-contacts-block__header">
          {block.heading && <h2 className="home-contacts-block__heading">{block.heading}</h2>}
          {block.intro && <p className="home-contacts-block__intro">{block.intro}</p>}
        </div>
      )}

      {(channels.length > 0 || socials.length > 0) && (
        <div className="contacts-body">
          {channels.length > 0 && (
            <div className="contacts-grid">
              {channels.map((ch) => (
                <div className="contact-card" key={ch.label}>
                  <p className="contact-card__label">{ch.label}</p>
                  <p className={`contact-card__value${ch.mono ? ' contact-card__value--mono' : ''}`}>
                    {ch.href && !ch.hrefLabel ? (
                      <a href={ch.href}>{ch.value}</a>
                    ) : (
                      ch.value
                    )}
                  </p>
                  {ch.href && ch.hrefLabel && (
                    <a
                      className="contact-card__action"
                      href={ch.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {ch.hrefLabel}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="square"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {socials.length > 0 && (
            <div className="contacts-socials">
              <p className="contacts-socials__label">{t('socials')}</p>
              <div className="contacts-socials__row">
                {socials.map((s) => (
                  <a
                    key={s.id ?? s.url}
                    className="social-pill"
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {SOCIAL_LABELS[s.platform] ?? s.platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
