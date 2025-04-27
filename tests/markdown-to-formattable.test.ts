import { describe, expect, test } from "bun:test";
import { markdownToFormattable } from "../src/markdown/index.ts";

describe("markdownToFormattable", () => {
	test("parses plain text", () => {
		const input = "Hello world";
		const actual = markdownToFormattable(input);
		expect(actual.text).toBe("Hello world");
	});

	test("parses bold text", () => {
		const input = "**bold**";
		const actual = markdownToFormattable(input);
		expect(actual.text).toBe("bold");
		expect(actual.entities[0].type).toBe("bold");
	});

	test("parses italic text", () => {
		const input = "*italic*";
		const actual = markdownToFormattable(input);
		expect(actual.text).toBe("italic");
		expect(actual.entities[0].type).toBe("italic");
	});

	test("parses strikethrough text", () => {
		const input = "~~strike~~";
		const actual = markdownToFormattable(input);
		expect(actual.text).toBe("strike");
		expect(actual.entities[0].type).toBe("strikethrough");
	});

	test("parses blockquote", () => {
		const input = "> quote";
		const actual = markdownToFormattable(input);
		expect(actual.text).toBe("quote");
		expect(actual.entities[0].type).toBe("blockquote");
	});

	test("parses heading", () => {
		const input = "# Heading";
		const actual = markdownToFormattable(input);
		expect(actual.text).toBe("Heading");
		expect(actual.entities[0].type).toBe("bold");
	});

	test("parses unordered list", () => {
		const input = "- item1\n- item2";
		const actual = markdownToFormattable(input);
		expect(actual.text).toBe("- item1\n- item2");
	});

	test("parses ordered list", () => {
		const input = "1. first\n2. second";
		const actual = markdownToFormattable(input);
		expect(actual.text).toBe("1 first\n2 second");
	});

	test("parses link", () => {
		const input = "[link](https://example.com)";
		const actual = markdownToFormattable(input);
		expect(actual.text).toBe("link");
		expect(actual.entities[0].type).toBe("text_link");
		expect(actual.entities[0].url).toBe("https://example.com");
	});

	test("parses image as link", () => {
		const input = "![alt](https://img.com)";
		const actual = markdownToFormattable(input);
		expect(actual.text).toBe("alt");
		expect(actual.entities[0].type).toBe("text_link");
		expect(actual.entities[0].url).toBe("https://img.com");
	});

	test("parses inline code", () => {
		const input = "`code`";
		const actual = markdownToFormattable(input);
		expect(actual.text).toBe("code");
		expect(actual.entities[0].type).toBe("code");
	});

	test("parses code block", () => {
		const input = "```js\nconsole.log(1)\n```";
		const actual = markdownToFormattable(input);
		expect(actual.text).toBe("console.log(1)");
		expect(actual.entities[0].type).toBe("pre");
		expect(actual.entities[0].language).toBe("js");
	});

	test("parses horizontal rule", () => {
		const input = "---";
		const actual = markdownToFormattable(input);
		expect(actual.text).toBe("---");
	});

	test("parses nested formatting", () => {
		const input = "**bold *italic***";
		const actual = markdownToFormattable(input);
		expect(actual.text).toBe("bold italic");
		expect(actual.entities.some((e) => e.type === "bold")).toBe(true);
		expect(actual.entities.some((e) => e.type === "italic")).toBe(true);
	});

	test("parses multiple paragraphs", () => {
		const input = "First\n\nSecond";
		const actual = markdownToFormattable(input);
		expect(actual.text).toBe("First\n\nSecond");
	});

	test("parses complex markdown", () => {
		const input =
			"# Title\n\n> Quote\n\n- **Bold**\n- *Italic*\n- [Link](https://a)\n\n`Code`";
		const actual = markdownToFormattable(input);
		console.error(actual);
		expect(actual.text.includes("Title")).toBe(true);
		expect(actual.text.includes("Quote")).toBe(true);
		expect(actual.text.includes("Bold")).toBe(true);
		expect(actual.text.includes("Italic")).toBe(true);
		expect(actual.text.includes("Link")).toBe(true);
		expect(actual.text.includes("Code")).toBe(true);
	});
});
