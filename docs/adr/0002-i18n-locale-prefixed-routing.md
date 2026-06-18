# i18n: locale-prefixed routing, RU as default locale

The storefront becomes multilingual across both UI chrome (next-intl message catalogs) and Payload content (`localization` config with `localized: true` fields on Products, Categories, SiteSettings). Locale is carried in the URL path prefix (`/ru/...`, `/en/...`) — the canonical next-intl setup — rather than a cookie. **RU is the default locale**; EN is a translation; missing content translations fall back to RU (`fallback: true`).

## Considered options

- **Cookie / no prefix** — rejected: minimal app-dir churn, but one URL serves both languages, hurting SEO and shareable per-locale links.
- **Locale prefix (chosen)** — SEO-friendly (indexable per-locale, hreflang) and the idiomatic next-intl approach, at the cost of restructuring `src/app/(frontend)` under an `app/[locale]/` segment and carrying the `products/@sidebar` parallel route along with it.

## Consequences

- The URL locale is the single source of truth and must drive the `locale` parameter passed to Payload Local API queries — UI locale and content locale stay coupled.
- Adding the Payload `localization` config retro-assigns existing single-value content to the default locale (RU); seed data should provide both locales going forward.
- A provider/locale that cannot fall back to RU would require revisiting the default-locale choice.
