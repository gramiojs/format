# @gramio/format

Library for [formatting](https://core.telegram.org/bots/api#messageentity) text for Telegram Bot API. Used under the hood by [GramIO](https://gramio.dev/) framework but it is framework-agnostic.

[![npm](https://img.shields.io/npm/v/@gramio/format?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/format)
[![JSR](https://jsr.io/badges/@gramio/format)](https://jsr.io/@gramio/format)
[![JSR Score](https://jsr.io/badges/@gramio/format/score)](https://jsr.io/@gramio/format)

## Installation

```sh
npm install @gramio/format
# or
bun add @gramio/format
```

## Overview

`@gramio/format` builds [`MessageEntity`](https://core.telegram.org/bots/api#messageentity) objects alongside the text so you never have to track character offsets manually. All formatters compose freely — nest them as deeply as you like.

```ts
import { format, bold, italic, link, spoiler } from "@gramio/format";

const msg = format`${bold`Hi!`}

Can ${italic("you")} help ${spoiler`me`}?

Can you give me a ${link("star", "https://github.com/gramiojs/gramio")}?`;

// msg.text     → the plain string
// msg.entities → ready-to-send MessageEntity[]
```

---

## Template literals

### `format`

Strips leading indentation from every line (safe to indent inside your source).

```ts
import { format, bold, italic } from "@gramio/format";

format`Hello ${bold("world")}!`
// text: "Hello world!"
// entities: [{ type: "bold", offset: 6, length: 5 }]
```

### `formatSaveIndents`

Same as `format` but preserves all whitespace exactly as written.

```ts
import { formatSaveIndents, code } from "@gramio/format";

formatSaveIndents`Run:\n    ${code("bun install")}`
```

---

## Formatters

Every formatter accepts either a plain string, a `FormattableString`, or a tagged template literal.

```ts
bold("text")
bold`text`
bold(italic("text"))   // nested: bold wraps italic
```

| Formatter | Telegram entity | Notes |
|---|---|---|
| `bold` | `bold` | Cannot be combined with `code` / `pre` |
| `italic` | `italic` | Cannot be combined with `code` / `pre` |
| `underline` | `underline` | Cannot be combined with `code` / `pre` |
| `strikethrough` | `strikethrough` | Cannot be combined with `code` / `pre` |
| `spoiler` | `spoiler` | Cannot be combined with `code` / `pre` |
| `blockquote` | `blockquote` | Cannot be nested |
| `expandableBlockquote` | `expandable_blockquote` | Cannot be nested |
| `code` | `code` | Inline monospace; cannot be combined with others |
| `pre(text, lang?)` | `pre` | Code block; optional language for syntax highlight |
| `link(text, url)` | `text_link` | Cannot be combined with `code` / `pre` |
| `mention(text, user)` | `text_mention` | |
| `customEmoji(emoji, id)` | `custom_emoji` | Requires purchased username on Fragment |

### Examples

```ts
import {
    bold, italic, underline, strikethrough, spoiler,
    blockquote, expandableBlockquote,
    code, pre, link, mention, customEmoji,
    format,
} from "@gramio/format";

bold`Important`
italic`Subtle`
underline`Marked`
strikethrough`Removed`
spoiler`Secret`

blockquote`A quote from someone wise.`
expandableBlockquote`A very long quote that can be collapsed.`

code`npm install`
pre("console.log('hi')", "js")

link("GramIO", "https://gramio.dev")
mention("John", { id: 1, is_bot: false, first_name: "John" })
customEmoji("⚔️", "5222106016283378623")

// Compose freely
format`${bold("Price")}: ${italic("$42")}\nSee ${link("docs", "https://gramio.dev")}`
```

---

## `join` — formatting arrays

Array `.join()` discards entities. Use `join` instead:

```ts
import { join, bold, format } from "@gramio/format";

const items = ["apple", "banana", "cherry"];

format`Shopping list:\n${join(items, (item) => bold(item), "\n")}`;
// text:     "Shopping list:\napple\nbanana\ncherry"
// entities: bold on each item at the correct offsets
```

The third argument is the separator (default `", "`). Return `null`, `undefined`, or `false` from the iterator to skip an item.

---

## `markdownToFormattable` — Markdown → FormattableString

Converts a Markdown string to a `FormattableString` with proper entities. Useful when your content comes from a Markdown source (e.g., API docs, user input).

**Requires [`marked`](https://marked.js.org/) as a peer dependency:**

```sh
npm install marked
```

```ts
import { markdownToFormattable } from "@gramio/format/markdown";

const result = markdownToFormattable(
    "# Title\n\n**bold** and *italic*\n\n> Blockquote\n\n[link](https://gramio.dev)"
);

// result.text     → "Title\n\nbold and italic\n\nBlockquote\n\nlink"
// result.entities → bold, italic, blockquote, text_link at correct offsets
```

### Supported Markdown elements

| Markdown | Result |
|---|---|
| `**text**` / `__text__` | bold |
| `*text*` / `_text_` | italic |
| `~~text~~` | strikethrough |
| `` `code` `` | inline code |
| ```` ```lang\n...\n``` ```` | pre block (with optional language) |
| `> text` | blockquote |
| `[text](url)` | link |
| `![alt](url)` | link (image → text link) |
| `# Heading` … `###### Heading` | bold |
| `- item` / `1. item` | list with bullet/number prefix |

---

## `htmlToFormattable` — HTML → FormattableString

Converts an HTML string to a `FormattableString`. Designed for HTML produced by rich-text editors such as **TipTap**, **ProseMirror**, or **Quill**.

**Requires [`node-html-parser`](https://github.com/taoqf/node-html-parser) as a peer dependency:**

```sh
npm install node-html-parser
```

```ts
import { htmlToFormattable } from "@gramio/format/html";

const result = htmlToFormattable(
    "<p><strong>Hello</strong> <em>world</em></p>"
);

// result.text     → "Hello world"
// result.entities → [bold offset=0 len=5, italic offset=6 len=5]
```

### Supported HTML elements

| Element | Result | Notes |
|---|---|---|
| `<strong>`, `<b>` | bold | |
| `<em>`, `<i>` | italic | |
| `<u>` | underline | |
| `<s>`, `<del>`, `<strike>` | strikethrough | |
| `<code>` | inline code | When not inside `<pre>` |
| `<pre><code class="language-js">` | pre block | Language extracted from `language-*` class |
| `<blockquote>` | blockquote | Children processed recursively |
| `<a href="...">` | link | |
| `<h1>` … `<h6>` | bold | |
| `<p>`, `<div>` | transparent wrapper | Children joined with `""` |
| `<br>` | `\n` | |
| `<ul>` | unordered list | Items prefixed with `- ` |
| `<ol start="N">` | ordered list | Items numbered from `start` |

Block-level elements at the root are separated by `\n\n`. List items are separated by `\n`. Nested lists are supported and indented with `\n` before the sub-list.

### TipTap example

```ts
import { htmlToFormattable } from "@gramio/format/html";

const html = `
<h1>Release notes</h1>
<p>Version <strong>2.0</strong> is out with <em>exciting</em> changes:</p>
<ul>
  <li><p>New <code>htmlToFormattable</code> function</p></li>
  <li><p>Performance improvements</p></li>
</ul>
<p>Read the <a href="https://gramio.dev">full docs</a>.</p>
`;

const result = htmlToFormattable(html);
// Sends correctly formatted message to Telegram with all entities intact
```

---

## Using with Telegram Bot API

The `FormattableString` object has `.text` and `.entities` properties that map directly to Telegram's `sendMessage` parameters:

```ts
import { format, bold, link } from "@gramio/format";

const msg = format`Check out ${bold(link("GramIO", "https://gramio.dev"))}!`;

await bot.api.sendMessage({
    chat_id: chatId,
    text: msg.text,
    entities: msg.entities,
});
```

With [GramIO](https://gramio.dev/) you can pass the `FormattableString` directly:

```ts
bot.on("message", (ctx) => {
    ctx.send(format`Hello ${bold(ctx.from.first_name)}!`);
});
```

---

## See also

- [Full documentation](https://gramio.dev/formatting.html)
- [GramIO framework](https://gramio.dev/)
- [Telegram MessageEntity docs](https://core.telegram.org/bots/api#messageentity)
