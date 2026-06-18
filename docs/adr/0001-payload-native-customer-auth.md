# Payload-native Customer authentication, email as identity key

Customer sign-in (password, magic link, Google, Yandex) is built on Payload's `customers` collection as the single source of truth — not on a parallel session layer such as Auth.js/NextAuth. OAuth and magic-link flows perform a find-or-create on the `customers` collection keyed by **verified email**, then issue the existing `customer-token` JWT. This keeps `getAuthenticatedUser` and the order access scoping (`orders` filtered by `customer.id`) unchanged.

## Considered options

- **Auth.js (NextAuth v5)** — rejected: convenient built-in providers, but introduces a second session Payload's access control does not understand. Orders are scoped by Payload `customer.id`, so every request would need the Auth.js session translated into a Payload auth and two user tables kept in sync. Two sources of truth for one Customer.
- **Payload-native (chosen)** — more manual OAuth/magic-link plumbing (lightweight helpers like arctic/oslo for the handshake), but one session, one identity store, and clearer for learning.

## Consequences

- Linking sign-in methods by email is only safe when the provider asserts `email_verified` (Google: yes; Yandex: yes with `login:email` scope). Providers that do not return a verified email cannot be added without revisiting this decision.
- Email/password stays enabled on `customers` (additive); magic link and OAuth are additional Sign-in methods, not replacements.
