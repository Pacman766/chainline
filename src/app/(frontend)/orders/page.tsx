import config from '@payload-config';
import { headers as getHeaders } from 'next/headers';
import { getPayload } from 'payload';
import { redirect } from 'next/navigation';

export default async function OrdersPage() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });

  if (!user) redirect('/login');

  const orders = payload.find({
    collection: 'orders',
    depth: 2,
    sort: '-createdAt',
    overrideAccess: false,
    user,
  });

  return <div></div>;
}
