# payload-start

Next.js 15 + Payload CMS v3 sandbox — built to explore headless CMS development with an AI-driven workflow.

## Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **CMS:** Payload CMS v3 — collections, globals, hooks, access control, Lexical rich text
- **Database:** PostgreSQL (`@payloadcms/db-postgres`)
- **UI:** Tailwind CSS v4, shadcn/ui, Radix UI
- **Payments:** Stripe
- **Storage:** Vercel Blob
- **Email:** Resend
- **Testing:** Vitest (integration), Playwright (E2E)
- **Infra:** Docker, docker-compose

## What is inside

- Custom Payload collections with typed access control rules
- Lexical editor with custom block types
- Payload Search plugin integration
- Stripe payment flow
- Full test suite: Vitest integration tests + Playwright E2E
- Dockerized local development

## Local setup

```bash
cp .env.example .env
# fill in POSTGRES_URL, PAYLOAD_SECRET, STRIPE_SECRET_KEY, RESEND_API_KEY
docker-compose up -d
npm install
npm run dev
```

```bash
npm run test:int   # Vitest integration tests
npm run test:e2e   # Playwright E2E tests
```
