import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-6">
      <h1 className="text-4xl font-bold tracking-tight">Добро пожаловать в Pac-Shop</h1>
      <p className="text-muted-foreground text-lg max-w-md">
        Учебный проект на Payload CMS + Next.js. Здесь можно посмотреть товары и протестировать
        авторизацию.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/products">Смотреть товары</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/admin" target="_blank">
            Админ панель
          </Link>
        </Button>
      </div>
    </div>
  );
}
