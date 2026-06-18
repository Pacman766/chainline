# Teaching Notes

## Learner profile
- Фон: ExtJS (много), немного Java. General web — middle/middle+.
- Уровни на старте: React junior-middle, Next junior, Payload junior.
- НЕ новичок: знает JS/TS, async/await, замыкания, ООП. Не объяснять базу программирования.

## Preferences
- Язык: русский (объяснения), английский (код).
- Формат: концепция (схема/модель) → потом практика на реальном коде проекта.
- Темп: интенсив, несколько часов в день.
- Без эмодзи, кратко и по делу (см. глобальные инструкции пользователя).

## Teaching strategy
- Привязывать новое к ExtJS-аналогиям где уместно (мост от знакомого):
  - ExtJS `Ext.create` / компоненты-классы → React функциональные компоненты + хуки.
  - ExtJS store/model → Payload collections + Local API.
  - ExtJS «всё на клиенте» → главный сдвиг: Server Components рендерятся на сервере.
- Каждый урок = ОДНА вещь + быстрый практический выигрыш на коде payload-start.
- Все уроки в `learning/lessons/`, справочники в `learning/reference/`.

## Open thread for next sessions
- [DONE] Урок 1 RSC + Практика 1 (categories) + Урок 3 routing App Router.
- [DONE] Практика 2 (`/categories/[slug]`) — учащийся сделал сам, влита через merge.
- [DONE] Урок 5 кеш/`revalidate` (`lessons/0005`): static vs dynamic, `revalidate 0/N`,
  on-demand `revalidatePath` на цепочке `products/afterChange` → `api/revalidate`.
- [DONE] Практика 3: `products/[id]/page.tsx` → `revalidate=60`. Учащийся увидел в билде
  `ƒ` (не `●`) — разобрали: `draftMode()` (чтение cookies) пиннит динамику, перебивая
  `revalidate`. On-demand п.3: `doc.id` из хука → тело POST → `revalidatePath('/products/${id}')`.
  П.4 откат: строку убрал. ЖИВОЕ ДЕМО провели на выкидном стенде `/cache-demo` (вне layout
  с Header → вышел `○`/ISR 1h): прод-билд, добавили published-товар → кеш отдавал старые 6 →
  `revalidatePath` → 7. Доказали, что ISR-кеш виден только в `build`+`start`, не в `dev`.
- [КЛЮЧЕВОЙ ВЫВОД] Тип рендера НАСЛЕДУЕТСЯ от layout: `cookies()` в общем `Header.tsx:60`
  тянет ВЕСЬ сторфронт в `ƒ`. Поэтому ISR на витрине недостижим, пока шапка читает куки.
- [BACKLOG / оптимизация, НЕ делать без трафика] Расцепить Header: server-shell + client-auth
  (кусок email/Войти → Client Component, дёргает `/api/users/me`) → layout перестаёт быть `ƒ`.
  Затем PPR (Next 15: `experimental.ppr:'incremental'` + `export const experimental_ppr=true`
  + Suspense-дырки; в Next 16 переименовано в `cacheComponents:true`, флаги убраны) на
  `/products/[id]` + `generateStaticParams` + `revalidate` + `revalidatePath('/products/${id}')`
  в хук. ROI только для SEO/трафика на карточки. Класс «accidentally-dynamic»: PDP, /contacts,
  /categories/[slug]. Класс «essential-dynamic» (не трогать): /products список, /cart, /orders.
- [ВЫДАН, жду учащегося] Урок 6 модель данных Payload (`lessons/0006-payload-data-model.html`):
  коллекция = единый источник правды (БД+admin+API+типы из одного config). Анатомия
  CollectionConfig, типы полей на Products.ts/Orders.ts, group vs collapsible (вложенность
  vs UI), field-level hooks (price round/null→0), ГЛАВНОЕ — access возвращает не только
  bool, но и where-фильтр (Orders read → row-level security). generate:types после правки схемы.
  Практика 4: добавить поле `sku` (text/unique/admin.position sidebar) в Products → dev push →
  generate:types → вывести на PDP; «на подумать» про field vs collection access. Статус: ЖДУ.
- [DONE] Практика 4 (поле `sku`): учащийся сделал. Споткнулся дважды (полезно): (1) вложил sku
  в группу `dimensions` → тип лёг как `product.dimensions.sku`, не `product.sku` — закрепили
  group=вложенность; (2) `admin.position:'sidebar'` → искал поле в центре формы, оно в правой
  панели. Разрулено. П.5 (на подумать) ответил верно: field-level `access.read: ONLY_AUTHENTICATED`.
- [СМЕНА ФОРМАТА с Урока 7, по просьбе учащегося 15 июня 2026] Практико-ориентированно:
  (1) краткий обзор темы → (2) разобранный практический пример СО СНОСКАМИ [n] построчно →
  (3) квиз + практика. Меньше теории, больше живого кода проекта. Держать этот формат дальше.
- [ВЫДАН, жду учащегося] Урок 7 Payload hooks (`lessons/0007-payload-hooks.html`): карта
  хуков (before/afterValidate/Change/Read/Delete, afterLogin), collection vs field, разбор
  `orders/afterChange` со сносками (guard по operation, relationship id-vs-object, try/catch
  вокруг побочки, return doc) + `beforeDelete` (throw → отмена операции). Ловушки: бесконечный
  цикл (context-флаг, связь с isSeeding) и латентность. Практика 5: серверный пересчёт
  `Orders.total` из items в `orders/beforeChange` (закрыть дыру «клиент подделал total»).
  Статус: ЖДУ реализацию → ревью.
- [DONE] Практика 5 (`orders/beforeChange`): учащийся реализовал. Хук пересчитывает total из
  items (Σ price×quantity), `data` не `doc`, тип элемента выведен через
  `NonNullable<Order['items']>[number]`. EVIDENCE: создал заказ с фейковым total 9999 (хардкод
  в `lib/orders.ts:73`) → в БД лёг пересчитанный 449700 (3×149900) даже в dev. Откат хардкода
  сделан. Ревью-замечания (убрать мёртвую проверку customer, `?? 0` на price/quantity) выданы.
  Коммит 8f73ea0 `feat(orders): recompute order total server-side in beforeChange hook`.
- [ВЫДАН, жду учащегося] Урок 8 React useReducer (`lessons/0008-react-usereducer-cart.html`):
  reducer = чистая ф-я `(state,action)=>newState`, иммутабельность (map/filter/спред, не
  splice/push), action как discriminated union → исчерпывающий switch + TS-сужение по `type`.
  Разбор `cartReducer.ts` построчно + подключение в `CartContext.tsx` (action creators прячут
  dispatch, totalItems/totalPrice выводятся через useMemo — не хранятся, два useEffect + флаг
  `initialized` против затирания localStorage на первом рендере). Мост от ExtJS Store. Практика 6:
  INCREMENT/DECREMENT экшены + exhaustiveness-guard (`const _exhaustive: never = action`),
  перевести +/- кнопки корзины на намерение вместо вычисленного quantity. Статус: ЖДУ → ревью.
- СЛЕДУЮЩЕЕ (после Практики 6) → parallel route `@sidebar` (тизер из Урока 3).
  Backlog: PPR+расцепление Header, `loading.tsx` для /products.
- [ВВЕДЕНО РУКАМИ при сборке /contacts] Payload globals + field types `group` и `array`,
  `payload.findGlobal`/`updateGlobal`, `generate:types` после правки схемы, dev push схемы.
  → При уроке по модели данных Payload опереться на `SiteSettings.ts` как на готовый пример,
    НЕ объяснять `group`/`array`/`findGlobal` с нуля — учащийся их уже трогал.
- Затем → хуки React глубже (useReducer на примере CartContext), потом Payload hooks.
- Практика-идея на потом: добавить `loading.tsx` для `/products` (Suspense-фолбэк).
