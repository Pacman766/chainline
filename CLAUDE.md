# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev                 # Start dev server (http://localhost:3000)
npm run devsafe             # Clean .next cache and start dev server
npm run build               # Production build
npm run lint                # ESLint

npm run test:int            # Vitest integration tests (tests/int/**/*.int.spec.ts)
npm run test:e2e            # Playwright E2E tests (tests/e2e/)
npm test                    # Both test suites

# Run a single vitest test file:
npx vitest run --config ./vitest.config.mts tests/int/api.int.spec.ts

npm run generate:types      # Regenerate payload-types.ts after schema changes
npm run generate:importmap

# Seed the database with sample bike products:
npx tsx src/seed.ts
```

## Environment Variables

Required in `.env`:
- `PAYLOAD_SECRET` — JWT secret for Payload CMS
- `DATABASE_URL` — SQLite file path (e.g. `file:./payload.db`)
- `ETHEREAL_USER` / `ETHEREAL_PASS` — Nodemailer test credentials (optional)

## Architecture

**Stack:** Next.js 15 (App Router) + Payload CMS 3.x + SQLite + Tailwind CSS 4 + shadcn/ui

The app has two route groups:
- `src/app/(frontend)/` — customer-facing storefront (React Server Components + Client Components)
- `src/app/(payload)/` — Payload admin panel (auto-generated, do not edit manually)

Custom API routes live in `src/app/api/`:
- `auth/customer-login` / `auth/customer-logout` — sets `customer-token` httpOnly cookie
- `checkout` — creates an Order from cart items (requires authenticated customer)
- `products-count` — public product count endpoint

## Payload Collections & Globals

Defined in `src/collections/` and `src/globals/`:

| Slug | Auth | Notes |
|------|------|-------|
| `users` | yes | Admin panel users only |
| `customers` | yes | Storefront shoppers; login via `/api/auth/customer-login` |
| `products` | no | `read: ALLOW_ALL`, `delete: RESTRICTED_ALL`; `status` defaults to `draft` on create |
| `categories` | no | Simple name/slug pairs |
| `media` | no | Uploads collection with image resizing via `sharp` |
| `orders` | no | Access scoped to owning customer |
| `site-settings` | — | Global: store name, banner text |

## Access Control

Reusable access functions are in `src/access/index.ts`:
- `ALLOW_ALL` / `RESTRICTED_ALL` / `ONLY_AUTHENTICATED` / `ONLY_ADMIN`

Orders access is inline — customers can only read their own orders (`customer: { equals: req.user.id }`).

## Hooks Pattern

Payload hooks live in `src/hooks/`:
- `products/beforeChange` — forces `status: draft` on create (skipped when `req.context.isSeeding = true`)
- `products/afterChange` — runs after product save
- `products/beforeDelete` — guard before deletion
- `orders/afterChange` — runs after order save (email notifications)
- `afterLogin` — runs after user login
- `cartReducer` — client-side reducer for CartContext (not a Payload hook)

When seeding or bypassing business logic in hooks, pass `context: { isSeeding: true }` to `payload.create()`.

## Cart & Auth Flow

`CartContext` (`src/contexts/CartContext.tsx`) is a client-side React Context using `useReducer` + `localStorage`. It wraps the entire frontend layout.

Two separate auth systems run in parallel:
1. **Admin users** — standard Payload JWT via `users` collection
2. **Customers** — separate `customers` collection, token stored as `customer-token` cookie

## Type Generation

`src/payload-types.ts` is auto-generated — never edit manually. Run `npm run generate:types` after any schema change.

## Testing

- Integration tests use Vitest + jsdom and call Payload Local API directly (no mocking). Test files: `tests/int/**/*.int.spec.ts`.
- E2E tests use Playwright (`tests/e2e/`). Helpers in `tests/helpers/` for seeding users and login.
- Test environment config is in `test.env`.

## Harness

- Read `AGENTS.md` at the start of every session
- Track features in `feature_list.json`
- Log progress in `claude-progress.md`
- Run `bash init.sh` to verify clean state
