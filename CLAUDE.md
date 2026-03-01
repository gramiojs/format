# @gramio/format — Developer Guide

Library for constructing [Telegram message entities](https://core.telegram.org/bots/api#messageentity) using tagged template literals and helper functions.

## Project structure

```
src/
  index.ts              — all public formatters (bold, italic, link, dateTime, …)
  formattable-string.ts — FormattableString class + Stringable type
  mutator.ts            — FormattableMap: decomposes FormattableString into API params
```

---

## Core concepts

### `FormattableString`

The central class. Holds two things:
- `text: string` — the plain text content
- `entities: TelegramMessageEntity[]` — entity offsets relative to `text`

All formatters return a `FormattableString`. When interpolated inside `format\`...\``, entities get their offsets shifted to the correct position in the combined string.

`FormattableString` implements `toString()` (returns `text`) and a custom `Symbol.hasInstance` so `instanceof FormattableString` works even across module boundaries (duck-typing: must have `text` and `entities` fields).

### `Stringable`

```ts
type Stringable = string | { toString(): string }
```

Any value accepted as input text. Plain strings and `FormattableString` instances are both `Stringable`.

---

## How formatters are built

### `buildFormatter(type)` — simple text formatters

For types with no extra options (bold, italic, underline, etc.).

```ts
const bold = buildFormatter("bold");
```

Supports three call styles:
1. `bold("text")` — plain string
2. `bold(italic("text"))` — nested FormattableString
3. `` bold`text` `` — tagged template literal

Internally wraps the input text in a single entity spanning the full length:
```ts
{ type, offset: 0, length: text.length }
```
Entities from any nested `FormattableString` are preserved and re-appended after the outer entity.

### `buildFormatterWithArgs(type, ...keys)` — formatters with extra fields

For types that carry additional data in the entity object (pre, link, mention, customEmoji, dateTime).

```ts
const link = buildFormatterWithArgs<[url: string]>("text_link", "url");
const pre  = buildFormatterWithArgs<[language?: string]>("pre", "language");
```

- The generic `T` declares the **runtime argument types** that callers pass.
- The rest params `...keys` are the **entity field names** (strings) matching Telegram's API.
- Internally: `Object.fromEntries(keys.map((key, i) => [key, args[i]]))` merges them into the entity.

**Typing caveat**: when `T[i]` is not `string` (e.g. `number` for `unix_time`, or `TelegramUser` for `user`), TypeScript will complain that a string key doesn't satisfy the type. Use `// @ts-expect-error` on that key, same as existing formatters do for `mention` and `dateTime`.

---

## How to add a new formatter

### 1. Simple formatter (no extra arguments)

Add one line to `src/index.ts`:

```ts
export const myFormat = buildFormatter("my_type");
```

Where `"my_type"` must be a valid `TelegramMessageEntityType` from `@gramio/types`.

Add a JSDoc comment above it following the pattern of `bold`, `italic`, etc.

### 2. Formatter with extra entity fields

```ts
export const myFormat = buildFormatterWithArgs<[field1: SomeType, field2?: string]>(
    "my_type",
    // @ts-expect-error if SomeType is not string
    "field1",
    "field2",
);
```

Rules:
- The generic type tuple `T` defines what the caller passes as args after the display text.
- Each positional element in `T` maps to a Telegram API entity field name in `...keys`.
- Optional args (`field?: string`) produce `undefined` in the entity when not supplied — Telegram ignores undefined fields.
- Add `@ts-expect-error` for any key whose T element is not `string | undefined`.

### 3. Update `TelegramMessageEntityType`

`TelegramMessageEntityType` comes from `@gramio/types` (auto-generated from Telegram's Bot API spec). If the new entity type is not yet in the type union, it will be added when `@gramio/types` is updated. Until then, you can cast with `as TelegramMessageEntityType`.

### 4. No changes needed in `mutator.ts`

`FormattableMap` in `mutator.ts` is about **decomposing** `FormattableString` into `text` + `entities` params for specific API methods. Adding a new entity type does **not** require changes there — entity data is already serialized correctly by `FormattableString.entities`.

---

## How `format` tag works

```ts
format`Hello ${bold("world")}!`
```

`format` calls `processRawFormat` which:
1. Iterates alternating string parts and interpolated values.
2. For each `FormattableString` value: shifts all its entity offsets by the current accumulated text length, then appends them to the entity list.
3. For plain strings/numbers: appends to text as-is.
4. Additionally strips single `\n` + leading whitespace (dedents template indentation). Use `formatSaveIndents` to skip this.

Result: a single `FormattableString` with the full concatenated text and all entities correctly positioned.

---

## Existing formatters reference

| Export | Entity type | Extra args |
|---|---|---|
| `bold` | `bold` | — |
| `italic` | `italic` | — |
| `underline` | `underline` | — |
| `strikethrough` | `strikethrough` | — |
| `spoiler` | `spoiler` | — |
| `blockquote` | `blockquote` | — |
| `expandableBlockquote` | `expandable_blockquote` | — |
| `code` | `code` | — |
| `pre` | `pre` | `language?: string` |
| `link` | `text_link` | `url: string` |
| `mention` | `text_mention` | `user: TelegramUser` |
| `customEmoji` | `custom_emoji` | `custom_emoji_id: string` |
| `dateTime` | `date_time` | `unix_time: number`, `date_time_format?: string` |

---

## Development

```bash
bun run lint        # biome check
bun run lint:fix    # biome check --apply
bunx pkgroll        # build dist/
```

Types come from `@gramio/types` (auto-generated from Telegram Bot API). Update the package when new entity types or fields are added upstream.
