import type { TelegramMessageEntity } from "@gramio/types";

/** Type which contains a string or has the ability to result in a string object */
export type Stringable =
	| string
	| {
			toString(): string;
	  };

/** Class-helper for work with formattable [entities](https://core.telegram.org/bots/api#messageentity) */
export class FormattableString {
	/** Text of FormattableString (auto covert to it if entities is unsupported)*/
	text: string;
	/** Entities of FormattableString */
	entities: TelegramMessageEntity[];

	/** Create new FormattableString */
	constructor(text: string, entities: TelegramMessageEntity[]) {
		this.text = text;
		this.entities = entities;
	}

	/** Create new FormattableString */
	static from(text: string, entities: TelegramMessageEntity[]) {
		return new FormattableString(text, entities);
	}

	toString() {
		return this.text;
	}

	toJSON() {
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

export function getFormattable(str: Stringable) {
	if (str instanceof FormattableString) return str;

	return new FormattableString(str.toString(), []);
}
