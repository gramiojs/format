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
});
