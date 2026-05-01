# Payload Start: Agent Instructions

## Startup Checklist (run every session)

1. Read this file (AGENTS.md)
2. Read `docs/ARCHITECTURE.md` and `docs/PRODUCT.md` (if they exist)
3. Run: `bash init.sh`
4. Check: `feature_list.json` — review current status of all features
5. Read `claude-progress.md` — understand what was done in previous sessions

## Session Protocol

**One feature at a time.** Never start a new feature while one is `in_progress`.

**Startup:**
- `pwd` → verify directory
- Read `claude-progress.md` → understand prior state
- Check `feature_list.json` → pick top-priority `not_started` feature
- `git log --oneline -5` → review recent commits
- `bash init.sh` → install deps, run checks

**Work:**
- Mark the chosen feature `in_progress` in `feature_list.json`
- Work only on that feature until complete or blocked
- Do NOT improve adjacent code unless it directly blocks the feature

**Finish:**
- Run all verification steps from `feature_list.json` checklist
- Only mark `pass` when you have concrete evidence
- Update `claude-progress.md` with session log
- `git commit` with message: `feat: [feature title] — [what changed]`
- Verify `bash init.sh` still passes (clean state)

## Architecture

**Stack:** Next.js 15 App Router + Payload CMS 3.x + SQLite + Tailwind CSS 4 + shadcn/ui

**Route groups:**
- `src/app/(frontend)/` — customer storefront (RSC + Client Components)
- `src/app/(payload)/` — Payload admin panel (do not edit)

**Auth system (dual):**
- Admin users → `users` collection, standard Payload JWT
- Customers → `customers` collection, `customer-token` httpOnly cookie
- Auth utility → `src/lib/auth.ts` — `getAuthenticatedUser()`

**Key patterns:**
- `getPayload({ config })` — singleton, call outside component functions
- `payload.auth({ headers })` — get current user in Server Component
- `overrideAccess: true` + `context: { isSeeding: true }` — for seed scripts
- CartContext in `src/contexts/CartContext.tsx` — useReducer + localStorage

**Collections:** users, customers, products, categories, media, orders
**Globals:** site-settings

## Code Standards

- TypeScript (no strict mode — project default)
- Named exports only
- Server Components for data fetching; Client Components only where needed (interactivity, hooks)
- No business logic in UI components

## Definition of Done

A feature is `pass` when:
- [ ] All verification steps in `feature_list.json` run and pass
- [ ] `npm run lint` exits 0
- [ ] `npm run test:int` exits 0
- [ ] App/service launches without errors (`npm run dev`)
- [ ] `bash init.sh` still works from a clean state
- [ ] No console errors introduced

## Anti-patterns (never do)

- Declare victory without running verification
- Mark `pass` without evidence in `feature_list.json`
- Work on multiple features in one session
- Leave `init.sh` broken at end of session
- Store context in chat — always write to files
