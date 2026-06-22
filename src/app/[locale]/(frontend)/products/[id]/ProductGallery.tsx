'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { shimmerDataURL } from '@/lib/shimmer';

type GalleryImage = {
  url: string;
  thumbUrl: string;
  alt: string;
};

export function ProductGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const t = useTranslations('pdp');

  if (images.length === 0) {
    return (
      <div className="pdp-gallery">
        <div className="pdp-gallery__main">
          <span className="pdp-gallery__no-img">{t('noImage')}</span>
        </div>
      </div>
    );
  }

  const current = images[active];

  return (
    <div className="pdp-gallery">
      <div className="pdp-gallery__main">
        <Image
          src={current.url}
          alt={current.alt || productName}
          fill
          className="object-contain"
          sizes="(max-width: 900px) 100vw, 48vw"
          placeholder="blur"
          blurDataURL={shimmerDataURL}
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="pdp-gallery__thumbs">
          {images.map((img, i) => (
            <button
              key={i}
              className={`pdp-thumb${i === active ? ' pdp-thumb--active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={t('photoAlt', { index: i + 1 })}
            >
              <Image
                src={img.thumbUrl}
                alt={img.alt || t('photoAlt', { index: i + 1 })}
                fill
                className="object-contain"
                sizes="68px"
                placeholder="blur"
                blurDataURL={shimmerDataURL}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
