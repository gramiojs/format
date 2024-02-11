# @gramio/format

Library for formatting text for Telegram Bot API

## Usage

```ts
bot.api.sendMessage({
    chat_id: 12321,
    text: format`${bold`Hi!`}

		Can ${italic("you")} help ${spoiler`me`}?
	
			Can you give me a ${link("star", "https://github.com/gramiojs/gramio")}?`,
});
```

![example](https://gramio.netlify.app/formatting/format.png)

## See [Documentation](https://gramio.netlify.app/formatting.html)
