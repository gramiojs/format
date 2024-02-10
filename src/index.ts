import {
	TelegramMessageEntity,
	TelegramMessageEntityType,
	TelegramUser,
} from "@gramio/types";

export interface Stringable {
	toString(): string;
}

export class FormattableString implements Stringable {
	text: string;
	entities: TelegramMessageEntity[];

	constructor(text: string, entities: TelegramMessageEntity[]) {
		this.text = text;
		this.entities = entities;
	}

	toString() {
		return this.text;
	}

	// ![INFO] - https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-3.html#instanceof-narrowing-through-symbolhasinstance
	static [Symbol.hasInstance](value: unknown): value is FormattableString {
		return (
			!!value &&
			typeof value === "object" &&
			"text" in value &&
			"entities" in value
		);
	}
}

function getFormattable(str: Stringable) {
	if (str instanceof FormattableString) return str;

	return new FormattableString(str.toString(), []);
}

// TODO: improve typings
function buildFormatter<T extends unknown[] = never>(
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

export const bold = buildFormatter("bold");

export const italic = buildFormatter("italic");

export const underline = buildFormatter("underline");

export const strikethrough = buildFormatter("strikethrough");

export const spoiler = buildFormatter("spoiler");

export const blockquote = buildFormatter("blockquote");

export const code = buildFormatter("code");

export const pre = buildFormatter<[language?: string]>("pre", "language");

export const link = buildFormatter<[url: string]>("text_link", "url");

export const mention = buildFormatter<[user: TelegramUser]>(
	"text_mention",
	//@ts-expect-error wrong typings.... but it's works fine
	"user",
);

export const customEmoji = buildFormatter<[custom_emoji_id: string]>(
	"custom_emoji",
	"custom_emoji_id",
);

// [INFO] Thanks https://github.com/grammyjs/parse-mode/blob/49ba35bac208536edfa6e8d4ea665ea0f7fff522/src/format.ts#L213
export function format(
	stringParts: TemplateStringsArray,
	...strings: Stringable[]
) {
	const entities: TelegramMessageEntity[] = [];
	let text = "";

	const length = Math.max(stringParts.length, strings.length);

	for (let index = 0; index < length; index++) {
		for (const str of [stringParts[index], strings[index]]) {
			if (str) text += str.toString();

			if (str instanceof FormattableString)
				entities.push(
					...str.entities.map((e) => ({
						...e,
						offset: e.offset + text.length,
					})),
				);
		}
	}

	return new FormattableString(text, entities);
}
