import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { getPayload, Payload } from 'payload';
import config from '@payload-config';
import { linkVerifiedCustomer, OAuthEmailNotVerifiedError } from '@/lib/oauth';

let payload: Payload;

const OAUTH_EMAIL = 'oauth-harness@test.dev';
const PWD_EMAIL = 'oauth-existing@test.dev';

async function cleanup() {
  for (const email of [OAUTH_EMAIL, PWD_EMAIL]) {
    await payload.delete({ collection: 'customers', where: { email: { equals: email } } });
  }
}

beforeAll(async () => {
  payload = await getPayload({ config });
  await cleanup();
});

afterAll(cleanup);

// ---------------------------------------------------------------------------
// describe: linkVerifiedCustomer — the email_verified gate (ADR 0001)
// ---------------------------------------------------------------------------

describe('linkVerifiedCustomer', () => {
  beforeEach(cleanup);

  it('creates a customer when the provider asserts a verified email', async () => {
    const customer = await linkVerifiedCustomer(payload, {
      email: OAUTH_EMAIL,
      emailVerified: true,
      profile: { firstName: 'Olga', lastName: 'Petrova' },
    });
    expect(customer.email).toBe(OAUTH_EMAIL);

    const found = await payload.find({
      collection: 'customers',
      where: { email: { equals: OAUTH_EMAIL } },
      overrideAccess: true,
    });
    expect(found.docs).toHaveLength(1);
  });

  it('resolves the SAME customer on a second verified sign-in (no duplicate)', async () => {
    const first = await linkVerifiedCustomer(payload, { email: OAUTH_EMAIL, emailVerified: true });
    const second = await linkVerifiedCustomer(payload, { email: OAUTH_EMAIL, emailVerified: true });
    expect(second.id).toBe(first.id);

    const found = await payload.find({
      collection: 'customers',
      where: { email: { equals: OAUTH_EMAIL } },
      overrideAccess: true,
    });
    expect(found.docs).toHaveLength(1);
  });

  it('links to an existing email/password customer by verified email (one identity)', async () => {
    const existing = await payload.create({
      collection: 'customers',
      data: { email: PWD_EMAIL, password: 'pw-test-123456' },
      overrideAccess: true,
    });

    const linked = await linkVerifiedCustomer(payload, { email: PWD_EMAIL, emailVerified: true });
    expect(linked.id).toBe(existing.id);
  });

  it('refuses to link when the provider did NOT assert a verified email', async () => {
    await expect(
      linkVerifiedCustomer(payload, { email: OAUTH_EMAIL, emailVerified: false }),
    ).rejects.toBeInstanceOf(OAuthEmailNotVerifiedError);

    const found = await payload.find({
      collection: 'customers',
      where: { email: { equals: OAUTH_EMAIL } },
      overrideAccess: true,
    });
    expect(found.docs).toHaveLength(0);
  });

  it('refuses to link when no email is provided', async () => {
    await expect(
      linkVerifiedCustomer(payload, { email: undefined, emailVerified: true }),
    ).rejects.toBeInstanceOf(OAuthEmailNotVerifiedError);
  });
});
