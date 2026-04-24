import Link from 'next/link';

export function PreviewBanner({ productId }: { productId: string }) {
  return (
    <div className="preview-banner">
      <span>Режим предпросмотра — черновик</span>
      <Link href={`/api/preview/exit?redirect=/products/${productId}`}>
        Выйти
      </Link>
    </div>
  );
}
