/**
 * @module
 *
 * Library for [formatting](https://core.telegram.org/bots/api#messageentity) text for Telegram Bot API
 *
 */
import type {
	TelegramMessageEntity,
	TelegramMessageEntityType,
	TelegramUser,
} from "@gramio/types";
import {
	FormattableString,
	type Stringable,
	getFormattable,
} from "./formattable-string.js";

export * from "./mutator.js";
export * from "./formattable-string.js";

// TODO: improve typings
function buildFormatter(type: TelegramMessageEntityType) {
	function formatter(str: Stringable): FormattableString;
	function formatter(
		strings: TemplateStringsArray,
		...values: Stringable[]
	): FormattableString;
	function formatter(
		first: Stringable | TemplateStringsArray,
		...rest: Stringable[]
	): FormattableString {
		if (
			Array.isArray(first) &&
			Object.prototype.hasOwnProperty.call(first, "raw")
		) {
			return formatter(
				format(first as unknown as TemplateStringsArray, ...rest),
			);
		}
		const formattable = getFormattable(first as Stringable);
		return new FormattableString(formattable.text, [
			{
				type,
				offset: 0,
				length: formattable.text.length,
			},
			...formattable.entities,
		]);
	}
	return formatter;
}

function buildFormatterWithArgs<T extends unknown[] = never>(
	type: TelegramMessageEntityType,
	...keys: T
) {
	return (str: Stringable, ...args: T) => {
		const formattable = getFormattable(str);
		const formattableArgs = Object.fromEntries(
			keys.map((key, i) => [key, args[i]]),
		);

		return new FormattableString(formattable.text, [
			{
				type,
				offset: 0,
				length: formattable.text.length,
				...formattableArgs,
			},
			...formattable.entities,
		]);
	};
}

/**
 * Format text as **bold**. Cannot be combined with `code` and `pre`.
 * @example
 * ```ts
 * bold`test`
 * format`test ${bold(italic("GramIO"))}`
 * format`Format text as ${bold`bold`}`;
 * ```
 * ![bold](https://gramio.dev/formatting/bold.png)
 */
export const bold = buildFormatter("bold");

/**
 * Format text as _italic_. Cannot be combined with `code` and `pre`.
 * @example
 * ```ts
 * italic`test`
 * format`test ${italic(bold("GramIO"))}`
 * format`Format text as ${italic`italic`}`;
 * ```
 * ![italic](https://gramio.dev/formatting/italic.png)
 */
export const italic = buildFormatter("italic");

/**
 * Format text as underline. Cannot be combined with `code` and `pre`.
 * @example
 * ```ts
 * underline`test`
 * format`test ${underline(bold("GramIO"))}`
 * format`Format text as ${underline`underline`}`;
 * ```
 * ![underline](https://gramio.dev/formatting/underline.png)
 */
export const underline = buildFormatter("underline");

/**
 * Format text as ~~strikethrough~~. Cannot be combined with `code` and `pre`.
 * @example
 * ```ts
 * strikethrough`test`
 * format`test ${strikethrough(bold("GramIO"))}`
 * format`Format text as ${strikethrough`strikethrough`}`;
 * ```
 * ![](https://gramio.dev/formatting/strikethrough.png)
 */
export const strikethrough = buildFormatter("strikethrough");

/**
 * Format text as spoiler. Cannot be combined with `code` and `pre`.
 * @example
 * ```ts
 * spoiler`test`
 * format`test ${spoiler(bold("GramIO"))}`
 * format`Format text as ${spoiler`spoiler`}`;
 * ```
 * ![spoiler](https://gramio.dev/formatting/spoiler.png)
 */
export const spoiler = buildFormatter("spoiler");

/**
 * Format text as blockquote. Cannot be nested.
 * @example
 * ```ts
 * blockquote`test`
 * format`test ${blockquote(bold("GramIO"))}`
 * format`Format text as ${blockquote`blockquote`}`;
 * ```
 * ![blockquote](https://gramio.dev/formatting/blockquote.png)
 */
export const blockquote = buildFormatter("blockquote");

/**
 * Format text as expandable blockquote. Cannot be nested.
 * @example
 * ```ts
 * blockquote`test`
 * format`test ${expandableBlockquote(bold("GramIO"))}`
 * format`Format text as ${expandableBlockquote`blockquote`}`;
 * ```
 * ![blockquote](https://gramio.dev/formatting/expandable_blockquote.png)
 */
export const expandableBlockquote = buildFormatter("expandable_blockquote");

/**
 * Format text as `code`. Cannot be combined with any other format.
 * @example
 * ```ts
 * code`test`
 * format`test ${code("copy it")}`
 * format`Format text as ${code`code`}`;
 * ```
 * ![code](https://gramio.dev/formatting/code.png)
 */
export const code = buildFormatter("code");

/**
 * Format text as ```pre```. Cannot be combined with any other format.
 * @example
 * ```ts
 * pre`test`
 * format`test ${pre(`console.log("GramIO")`, "js")}`
 * ```
 * pre with language result is
 * ```js
 * console.log("GramIO")
 * ```
 * [Supported languages](https://github.com/TelegramMessenger/libprisma#supported-languages)
 *
 * ![pre](https://gramio.dev/formatting/pre.png)
 */
export const pre = buildFormatterWithArgs<[language?: string]>(
	"pre",
	"language",
);

/**
 * Format text as [link](https://github.com/gramiojs/gramio). Cannot be combined with `code` and `pre`.
 * @example
 * ```ts
 * link("test", "https://...")
 * format`test ${bold(link("GramIO", "https://github.com/gramiojs/gramio"))}`
 * format`Format text as ${link("link", "https://github.com/gramiojs/gramio")}`;
 * ```
 * ![link](https://gramio.dev/formatting/link.png)
 */
export const link = buildFormatterWithArgs<[url: string]>("text_link", "url");

/**
 * Format text as mention. Cannot be combined with `code` and `pre`.
 * @example
 * ```ts
 * mention("friend", { id: 228, is_bot: false, first_name: "GramIO"})
 * format`test ${mention("friend", { id: 228, is_bot: false, first_name: "GramIO"})}`
 * ```
 * ![mention](https://gramio.dev/formatting/mention.png)
 */
export const mention = buildFormatterWithArgs<[user: TelegramUser]>(
	"text_mention",
	// @ts-expect-error wrong typings.... but it's works fine
	"user",
);

/**
 * Insert custom emoji by their id.
 * @example
 * ```ts
 * customEmoji("⚔️", "5222106016283378623")
 * format`test ${customEmoji("⚔️", "5222106016283378623")}`
 * ```
 * **NOTE**: Custom emoji entities can only be used by bots that purchased additional usernames on [Fragment](https://fragment.com/).
 */
export const customEmoji = buildFormatterWithArgs<[custom_emoji_id: string]>(
	"custom_emoji",
	"custom_emoji_id",
);

/**
 * Helper for great work with formattable arrays. ([].join break styling)
 * Separator by default is `, `
 * @example
 * ```ts
 * format`${join(["test", "other"], (x) => format`${bold(x)}`, "\n")}`
 * ```
 */
export function join<T>(
	array: T[],
	iterator: (item: T, index: number) => Stringable | false | undefined | null,
	separator = ", ",
) {
	let text = "";
	const entities: TelegramMessageEntity[] = [];

	for (const [index, str] of array.map(iterator).entries()) {
		if (str instanceof FormattableString)
			entities.push(
				...str.entities.map((e) => ({
					...e,
					offset: e.offset + text.length,
				})),
			);
		if (typeof str !== "undefined" && str !== null && str !== false)
			text += str.toString() + (index === array.length - 1 ? "" : separator);
	}

	return new FormattableString(text, entities);
}

function processDeeperFormat(offset: number, strings: Stringable[]) {
	let text = "";
	const entities: TelegramMessageEntity[] = [];

	for (const str of strings) {
		if (Array.isArray(str)) {
			const [newText, newEntities] = processDeeperFormat(text.length, str);

			text += newText;
			entities.push(...newEntities);
			continue;
		}
		if (str instanceof FormattableString)
			entities.push(
				...str.entities.map((e) => ({
					...e,
					offset: e.offset + text.length + offset,
				})),
			);
		text += str.toString();
	}

	return [text, entities] as const;
}

// [INFO] Thanks https://github.com/grammyjs/parse-mode/blob/49ba35bac208536edfa6e8d4ea665ea0f7fff522/src/format.ts#L213
function processRawFormat(stringParts: string[], strings: Stringable[]) {
	const entities: TelegramMessageEntity[] = [];
	let text = "";

	const length = Math.max(stringParts.length, strings.length);

	for (let index = 0; index < length; index++) {
		for (const str of [stringParts[index], strings[index]]) {
			if (Array.isArray(str)) {
				const [newText, newEntities] = processDeeperFormat(text.length, str);

				text += newText;
				entities.push(...newEntities);
				continue;
			}
			if (str instanceof FormattableString)
				entities.push(
					...str.entities.map((e) => ({
						...e,
						offset: e.offset + text.length,
					})),
				);

			if (typeof str !== "undefined") text += str.toString();
		}
	}

	return new FormattableString(text, entities);
}

/**
 * [Template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
 * that helps construct message [entities](https://core.telegram.org/bots/api#messageentity) for text formatting.
 *
 * [Documentation](https://gramio.dev/formatting/)
 *
 *  Use if you want to strip all of the indentation from the beginning of each line.
 *
 * **NOTE**: for format with **arrays** use it with {@link join} helper -
 * ```ts
 * format`${join(["test", "other"], (x) => format`${bold(x)}`, "\n")}`
 * ```
 *
 * @example
 * ```ts
 * bot.api.sendMessage({
 *      chat_id: 12321,
 *      text: format`${bold`Hi!`}
 *          Can ${italic(`you`)} help ${spoiler`me`}?
 *              Can you give me a ${link("star", "https://github.com/gramiojs/gramio")}?`
 * })
 * ```
 *
 * ![format](https://gramio.dev/formatting/format.png)
 */
export function format(
	stringParts: TemplateStringsArray,
	...strings: Stringable[]
) {
	return processRawFormat(
		stringParts.map((x) => x.replace(/(?!\n\s+\n)\n(?!\n)\s+/g, "\n")),
		strings,
	);
}

/**
 * [Template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
 * that helps construct message [entities](https://core.telegram.org/bots/api#messageentity) for text formatting.
 *
 *	[Documentation](https://gramio.dev/formatting/)
 *
 *  Use if you want to save all of the indentation.
 *
 *  **NOTE**: for format with **arrays** use it with {@link join} helper -
 * ```ts
 * format`${join(["test", "other"], (x) => format`${bold(x)}`, "\n")}`
 * ```
 *
 * @example
 * ```ts
 * bot.api.sendMessage({
 *      chat_id: 12321,
 *      text: format`${bold`Hi!`}
 *          Can ${italic(`you`)} help ${spoiler`me`}?
 *              Can you give me a ${link("star", "https://github.com/gramiojs/gramio")}?`
 * })
 * ```
 *
 * ![formatSaveIndents](https://gramio.dev/formatting/format-save-indents.png)
 */
export function formatSaveIndents(
	stringParts: TemplateStringsArray,
	...strings: Stringable[]
) {
	return processRawFormat([...stringParts], strings);
}
