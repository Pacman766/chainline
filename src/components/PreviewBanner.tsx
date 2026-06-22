import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export async function PreviewBanner({ productId }: { productId: string }) {
  const t = await getTranslations('preview');
  return (
    <div className="preview-banner">
      <span>{t('label')}</span>
      <Link href={`/api/preview/exit?redirect=/products/${productId}`}>
        {t('exit')}
      </Link>
    </div>
  );
}
