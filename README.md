# @gramio/format

Library for [formatting](https://core.telegram.org/bots/api#messageentity) text for Telegram Bot API. Used under the hood by [GramIO](https://gramio.dev/) framework but it framework-agnostic.

[![npm](https://img.shields.io/npm/v/@gramio/format?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/format)
[![JSR](https://jsr.io/badges/@gramio/format)](https://jsr.io/@gramio/format)
[![JSR Score](https://jsr.io/badges/@gramio/format/score)](https://jsr.io/@gramio/format)

## Usage

```ts
bot.api.sendMessage({
    chat_id: 12321,
    text: format`${bold`Hi!`}

		Can ${italic("you")} help ${spoiler`me`}?
	
			Can you give me a ${link("star", "https://github.com/gramiojs/gramio")}?`,
});
```

![example](https://gramio.dev/formatting/format.png)

## See [Documentation](https://gramio.dev/formatting.html)
