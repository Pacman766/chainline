# Chainline

Storefront for premium cycling equipment built on Next.js 15 + Payload CMS 3. This glossary defines the domain language; it is not a spec.

## Language

**Customer**:
A storefront shopper who browses products, holds a cart, and places orders. Authenticates against the `customers` collection via the `customer-token` cookie.
_Avoid_: User (means something else here), buyer, account, client.

**User**:
An administrator of the Payload CMS admin panel. Authenticates against the `users` collection via standard Payload JWT.
_Avoid_: Customer, account, admin-user (just "User").

**Sign-in method**:
A way a **Customer** proves they own their email: password, magic link, or an OAuth provider (Google, …). Multiple methods can authenticate the same **Customer**.
_Avoid_: provider account, identity (these would imply separate records — they are not).

**Content block**:
A reusable, admin-composable section of the homepage (e.g. feature grid, CTA, featured products), stored as a Payload `blocks` field and localized via Payload content localization.
_Avoid_: widget, module, component (overloaded with React components).

**Hero**:
The bespoke top section of the homepage with the interactive animation. Not a **Content block** — it is a fixed, code-owned section, not admin-composable.

## Relationships

- A **Customer** places zero or more **Orders**; an **Order** belongs to exactly one **Customer**.
- A **User** never places **Orders**; a **Customer** never accesses the admin panel.
- A **Customer** is uniquely identified by their **verified email**. All **Sign-in methods** that yield the same verified email resolve to the same **Customer** (find-or-create by email).

## Flagged ambiguities

- "авторизация / login" was used generically — resolved: the new social/magic-link sign-in applies to **Customer** only. **User** sign-in stays email+password JWT and is out of scope for these features.
- "добавить русский" — resolved: Russian is the **base/default locale** (RU); English is added as a **translation**. Missing translations fall back to RU. (A momentary "fallback to English" answer was reconciled: EN is not the base.)
