import { describe, expect, test } from "bun:test";
import type { TelegramMessageEntity, TelegramUser } from "@gramio/types";
import {
	blockquote,
	bold,
	code,
	customEmoji,
	expandableBlockquote,
	format,
	formatSaveIndents,
	italic,
	join,
	link,
	mention,
	pre,
	spoiler,
	strikethrough,
	underline,
} from "../src/index.ts";

describe("Usage format`` thing", () => {
	test("bold formats text as bold entity", () => {
		const actual = bold("test");
		expect(actual.text).toBe("test");
		expect(actual.entities).toEqual([{ type: "bold", offset: 0, length: 4 }]);
	});

	test("italic formats text as italic entity", () => {
		const actual = italic("test");
		expect(actual.text).toBe("test");
		expect(actual.entities).toEqual([{ type: "italic", offset: 0, length: 4 }]);
	});

	test("underline formats text as underline entity", () => {
		const actual = underline("test");
		expect(actual.text).toBe("test");
		expect(actual.entities).toEqual([
			{ type: "underline", offset: 0, length: 4 },
		]);
	});

	test("strikethrough formats text as strikethrough entity", () => {
		const actual = strikethrough("test");
		expect(actual.text).toBe("test");
		expect(actual.entities).toEqual([
			{ type: "strikethrough", offset: 0, length: 4 },
		]);
	});

	test("spoiler formats text as spoiler entity", () => {
		const actual = spoiler("test");
		expect(actual.text).toBe("test");
		expect(actual.entities).toEqual([
			{ type: "spoiler", offset: 0, length: 4 },
		]);
	});

	test("blockquote formats text as blockquote entity", () => {
		const actual = blockquote("test");
		expect(actual.text).toBe("test");
		expect(actual.entities).toEqual([
			{ type: "blockquote", offset: 0, length: 4 },
		]);
	});

	test("expandableBlockquote formats text as expandable_blockquote entity", () => {
		const actual = expandableBlockquote("test");
		expect(actual.text).toBe("test");
		expect(actual.entities).toEqual([
			{ type: "expandable_blockquote", offset: 0, length: 4 },
		]);
	});

	test("code formats text as code entity", () => {
		const actual = code("test");
		expect(actual.text).toBe("test");
		expect(actual.entities).toEqual([{ type: "code", offset: 0, length: 4 }]);
	});

	test("pre formats text as pre entity with language", () => {
		const actual = pre("console.log()", "js");
		expect(actual.text).toBe("console.log()");
		expect(actual.entities).toEqual([
			{ type: "pre", offset: 0, length: 13, language: "js" },
		]);
	});

	test("link formats text as text_link entity", () => {
		const actual = link("test", "https://example.com");
		expect(actual.text).toBe("test");
		expect(actual.entities).toEqual([
			{ type: "text_link", offset: 0, length: 4, url: "https://example.com" },
		]);
	});

	test("mention formats text as text_mention entity", () => {
		const user: TelegramUser = { id: 1, is_bot: false, first_name: "Test" };
		const actual = mention("test", user);
		expect(actual.text).toBe("test");
		expect(actual.entities).toEqual([
			{ type: "text_mention", offset: 0, length: 4, user },
		]);
	});

	test("customEmoji formats text as custom_emoji entity", () => {
		const actual = customEmoji("⚔️", "123456");
		expect(actual.text).toBe("⚔️");
		expect(actual.entities).toEqual([
			{ type: "custom_emoji", offset: 0, length: 2, custom_emoji_id: "123456" },
		]);
	});

	test("join combines array of formattable strings", () => {
		const arr = ["a", "b"];
		const actual = join(arr, (x) => bold(x), ", ");
		expect(actual.text).toBe("a, b");
		expect(actual.entities).toEqual([
			{ type: "bold", offset: 0, length: 1 },
			{ type: "bold", offset: 3, length: 1 },
		]);
	});

	test("format creates entities for template literals", () => {
		const actual = format`${bold("a")} ${italic("b")}`;
		expect(actual.text).toBe("a b");
		expect(actual.entities).toEqual([
			{ type: "bold", offset: 0, length: 1 },
			{ type: "italic", offset: 2, length: 1 },
		]);
	});

	test("formatSaveIndents preserves indentation", () => {
		const actual = formatSaveIndents`a
  ${bold("b")}`;
		expect(actual.text).toBe("a\n  b");
		expect(actual.entities).toEqual([{ type: "bold", offset: 4, length: 1 }]);
	});

	test("nested formatters produce correct entities and text", () => {
		const actual = format`${bold(italic("a"))} ${underline(strikethrough("b"))} ${spoiler(bold(italic("c")))}`;
		expect(actual.text).toBe("a b c");
		// TODO: More tests about order. is it matter?
		expect(actual.entities).toEqual([
			{ type: "bold", offset: 0, length: 1 },
			{ type: "italic", offset: 0, length: 1 },
			{ type: "underline", offset: 2, length: 1 },
			{ type: "strikethrough", offset: 2, length: 1 },
			{ type: "spoiler", offset: 4, length: 1 },
			{ type: "bold", offset: 4, length: 1 },
			{ type: "italic", offset: 4, length: 1 },
		]);
	});

	test("deep join with nested formatters", () => {
		const arr = ["x", "y"];
		const actual = join(
			arr,
			(item, i) => format`${bold(item)}${italic(item)}`,
			"|",
		);
		expect(actual.text).toBe("xx|yy");
		expect(actual.entities).toEqual([
			{ type: "bold", offset: 0, length: 1 },
			{ type: "italic", offset: 1, length: 1 },
			{ type: "bold", offset: 3, length: 1 },
			{ type: "italic", offset: 4, length: 1 },
		]);
	});

	test("triple nested join and format", () => {
		const arr = ["a", "b"];
		const actual = format`${join(arr, (x) => format`${bold(x)}${italic(x)}`, ",")}`;
		expect(actual.text).toBe("aa,bb");
		expect(actual.entities).toEqual([
			{ type: "bold", offset: 0, length: 1 },
			{ type: "italic", offset: 1, length: 1 },
			{ type: "bold", offset: 3, length: 1 },
			{ type: "italic", offset: 4, length: 1 },
		]);
	});

	test("complex nested format with link, mention, customEmoji", () => {
		const user: TelegramUser = { id: 42, is_bot: false, first_name: "User" };
		const actual = format`${bold(link("l", "https://l"))} ${italic(mention("m", user))} ${spoiler(customEmoji("e", "id"))}`;
		expect(actual.text).toBe("l m e");
		console.log(actual.entities);
		expect(actual.entities).toEqual([
			{ type: "bold", offset: 0, length: 1 },
			{ type: "text_link", offset: 0, length: 1, url: "https://l" },
			{ type: "italic", offset: 2, length: 1 },
			{ type: "text_mention", offset: 2, length: 1, user },
			{ type: "spoiler", offset: 4, length: 1 },
			{ type: "custom_emoji", offset: 4, length: 1, custom_emoji_id: "id" },
		]);
	});

	test("deeply nested formatSaveIndents", () => {
		const actual = formatSaveIndents`A
  ${bold`${italic("B")} ${underline("C")}`}
  D`;
		expect(actual.text).toBe("A\n  B C\n  D");
		expect(actual.entities).toEqual([
			{ type: "bold", offset: 4, length: 3 },
			{ type: "italic", offset: 4, length: 1 },
			{ type: "underline", offset: 6, length: 1 },
		]);
	});
});
