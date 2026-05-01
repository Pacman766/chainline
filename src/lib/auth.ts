import { getPayload } from 'payload';
import config from '@payload-config';
import { headers as getHeaders, cookies } from 'next/headers';

export async function getAuthenticatedUser() {
  const payload = await getPayload({ config });
  const headers = await getHeaders();
  const cookieStore = await cookies();

  const customerToken = cookieStore.get('customer-token')?.value;
  if (customerToken) {
    const authHeaders = new Headers(headers);
    authHeaders.set('Authorization', `JWT ${customerToken}`);
    const { user } = await payload.auth({ headers: authHeaders });
    return user;
  }

  const { user } = await payload.auth({ headers });
  return user;
}
