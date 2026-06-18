import { CatalogShell } from '@/components/CatalogShell';

export default function ProductsLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return <CatalogShell sidebar={sidebar}>{children}</CatalogShell>;
}
