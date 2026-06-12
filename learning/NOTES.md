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
- СЛЕДУЮЩЕЕ (всплыло дважды, уже трогал руками) → кеширование/`revalidate` в Next:
  static vs dynamic rendering, `revalidate = 0`, `revalidate` по времени, on-demand
  (в проекте есть `api/revalidate/route.ts` + hooks ревалидации продуктов).
- Затем → parallel route `@sidebar` (тизер дан в Уроке 3) ИЛИ Payload collections/fields/access.
- [ВВЕДЕНО РУКАМИ при сборке /contacts] Payload globals + field types `group` и `array`,
  `payload.findGlobal`/`updateGlobal`, `generate:types` после правки схемы, dev push схемы.
  → При уроке по модели данных Payload опереться на `SiteSettings.ts` как на готовый пример,
    НЕ объяснять `group`/`array`/`findGlobal` с нуля — учащийся их уже трогал.
- Затем → хуки React глубже (useReducer на примере CartContext), потом Payload hooks.
- Практика-идея на потом: добавить `loading.tsx` для `/products` (Suspense-фолбэк).
