import { getPayload } from 'payload';
import config from '@payload-config';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { draftMode } from 'next/headers';
import { unstable_cache } from 'next/cache';
import { ProductDescription } from '../ProductDescription';
import { ProductGallery } from './ProductGallery';
import { PdpAddToCart } from './PdpAddToCart';
import { PreviewBanner } from '@/components/PreviewBanner';

// Cached fetch of the PUBLISHED product. Keyed by id and tagged so that
// `revalidateTag('product-<id>')` / `revalidateTag('products')` (fired from the
// Payload afterChange/delete hooks via /api/revalidate) purge it on edit.
const getPublishedProduct = (id: string, locale: 'ru' | 'en') =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config });
      return payload.findByID({
        collection: 'products',
        id,
        locale,
        depth: 1,
        draft: false,
        overrideAccess: false,
      });
    },
    ['product', id, locale],
    { tags: [`product-${id}`, 'products'] },
  )();

export default async function ProductPage({ params }: { params: Promise<{ id: string; locale: 'ru' | 'en' }> }) {
  const { id, locale } = await params;
  const t = await getTranslations('pdp');

  // Tradeoff note: calling draftMode() opts the route into dynamic rendering.
  // We only read it for the preview branch; non-preview visitors still benefit
  // because the DB call goes through unstable_cache — repeat visits skip the
  // Payload init + Neon round-trip entirely (the dominant cost), even though the
  // route itself is dynamic due to draftMode().
  const { isEnabled: isPreview } = await draftMode();

  let product;
  if (isPreview) {
    const payload = await getPayload({ config });
    product = await payload.findByID({
      collection: 'products',
      id,
      locale,
      depth: 1,
      draft: true,
      overrideAccess: true,
    });
  } else {
    product = await getPublishedProduct(id, locale);
  }

  const category = typeof product.category === 'object' && product.category !== null
    ? product.category
    : null;

  const galleryImages = (product.images ?? [])
    .filter((img): img is Exclude<typeof img, string | number> => typeof img === 'object' && img !== null)
    .map((img) => {
      const anyImg = img as unknown as Record<string, unknown> & { url?: string | null; alt?: string | null };
      const sizes = anyImg.sizes as Record<string, { url?: string | null }> | undefined;
      return {
        url: sizes?.hero?.url ?? sizes?.card?.url ?? anyImg.url ?? '',
        thumbUrl: sizes?.thumbnail?.url ?? anyImg.url ?? '',
        alt: (anyImg.alt as string | undefined) ?? product.name,
      };
    })
    .filter((img) => img.url) as { url: string; thumbUrl: string; alt: string }[];

  const dims = product.dimensions;
  const hasSpecs = dims && (dims.weight || dims.width || dims.height);

  return (
    <>
      {isPreview && <PreviewBanner productId={id} />}
      <div className="pdp-shell">
      <ProductGallery images={galleryImages} productName={product.name} />

      <div className="pdp-info">
        <Link href="/products" className="pdp-back">
          <ArrowLeft size={14} />
          {t('backToCatalog')}
        </Link>

        {category && <p className="pdp-category">{category.name}</p>}
        <h1 className="pdp-title">{product.name}</h1>

        <span className={`pdp-stock ${product.inStock ? 'pdp-stock--in' : 'pdp-stock--out'}`}>
          {product.inStock ? t('inStock') : t('outOfStock')}
        </span>

        <div className="pdp-price-row">
          <span className="pdp-price">{Intl.NumberFormat('ru-RU').format(product.price ?? 0)} ₽</span>
          <PdpAddToCart
            product={{
              productId: String(product.id),
              name: product.name,
              price: product.price,
              quantity: 1,
            }}
          />
        </div>

        {product.description && (
          <>
            <div className="pdp-divider" />
            <p className="pdp-section-label">{t('description')}</p>
            <div className="pdp-description">
              <ProductDescription data={product.description} />
            </div>
          </>
        )}

        {hasSpecs && (
          <>
            <div className="pdp-divider" />
            <p className="pdp-section-label">{t('specs')}</p>
            <div className="pdp-specs">
              {dims.weight && (
                <div className="pdp-spec-card">
                  <span className="pdp-spec-card__label">{t('weight')}</span>
                  <span className="pdp-spec-card__val">{dims.weight}</span>
                  <span className="pdp-spec-card__unit">{t('unitG')}</span>
                </div>
              )}
              {dims.width && (
                <div className="pdp-spec-card">
                  <span className="pdp-spec-card__label">{t('width')}</span>
                  <span className="pdp-spec-card__val">{dims.width}</span>
                  <span className="pdp-spec-card__unit">{t('unitCm')}</span>
                </div>
              )}
              {dims.height && (
                <div className="pdp-spec-card">
                  <span className="pdp-spec-card__label">{t('height')}</span>
                  <span className="pdp-spec-card__val">{dims.height}</span>
                  <span className="pdp-spec-card__unit">{t('unitCm')}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
}
