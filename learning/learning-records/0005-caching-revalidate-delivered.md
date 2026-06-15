# Практика 2 закрыта + Урок 5 (кеш/revalidate) выдан

**Практика 2 (динамический `/categories/[slug]`) — DONE учащимся.** Реализована им
самостоятельно и влита через merge (его коммит `add dynamic route for categories`,
43745ea): полноценная страница с `await params`, `notFound()`, `payload.find` по
slug + второй запрос за товарами категории, грид с `Image`/`AddToCartButton`.
При merge добавился `export const revalidate = 0;` — удачно лёг как зацепка под Урок 5.
(Конфликт в шапке файла разрулил агент: оставил `revalidate = 0` + Promise-тип params.)

**Урок 5 (`lessons/0005-caching-revalidate.html`) — ВЫДАН.** Тема всплывала трижды,
руками уже трогал. Покрыто:
- static by default vs dynamic rendering; легенда билда `○`/`ƒ`.
- триггеры динамики (cookies/headers/searchParams/`force-dynamic`/`revalidate=0`/no-store).
- тонкость: Payload Local API (`payload.find`) Next не отслеживает для кеша → отсюда
  `revalidate = 0` на всех витринных страницах проекта.
- ручка `export const revalidate`: `false` / `0` / `N` (ISR).
- on-demand: реальная цепочка `products/afterChange` → POST `/api/revalidate` (секрет,
  skip при `isSeeding`) → `revalidatePath('/products')`. Зачем секрет.
- **острый вопрос (mid-level):** при `revalidate=0` on-demand-хук дублирует цель/холостой;
  спойлер с тремя трактовками + «зрелый» паттern ISR + on-demand для headless CMS.
- `revalidatePath` vs `revalidateTag`. Квиз 4 вопроса.

**Практика 3 (выдана, пишет учащийся):** перевести `products/[id]/page.tsx` на ISR
(`revalidate = 60`), проверить метку в билде, продумать on-demand сброс конкретной
карточки (`revalidatePath('/products/42')`). Статус: ВЫДАНА, жду реализацию → ревью.

**Implications:** после Практики 3 фундамент рендеринга/данных Next закрыт. Дальше по
плану на выбор: parallel route `@sidebar` (тизер из Урока 3) ИЛИ модель данных Payload
(collections/fields/access — опереться на готовый `SiteSettings.ts`, `group`/`array`
учащийся уже трогал руками).
