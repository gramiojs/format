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
		expect(actual.text).toBe("1. first\n2. second");
	});

	test("parses ordered list with custom start", () => {
		const input = "5. fifth\n6. sixth";
		const actual = markdownToFormattable(input);
		expect(actual.text).toBe("5. fifth\n6. sixth");
	});

	test("parses nested unordered list", () => {
		const input = "- item1\n  - nested1\n  - nested2\n- item2";
		const actual = markdownToFormattable(input);
		console.log("Nested unordered:", actual.text);
		expect(actual.text).toContain("item1");
		expect(actual.text).toContain("nested1");
		expect(actual.text).toContain("nested2");
		expect(actual.text).toContain("item2");
	});

	test("parses nested ordered list", () => {
		const input =
			"1. first\n   1. nested first\n   2. nested second\n2. second";
		const actual = markdownToFormattable(input);
		console.log("Nested ordered:", actual.text);
		expect(actual.text).toContain("first");
		expect(actual.text).toContain("nested first");
		expect(actual.text).toContain("nested second");
		expect(actual.text).toContain("second");
	});

	test("parses mixed nested lists", () => {
		const input =
			"1. ordered\n   - unordered nested\n   - another nested\n2. second ordered";
		const actual = markdownToFormattable(input);
		console.log("Mixed nested:", actual.text);
		expect(actual.text).toContain("ordered");
		expect(actual.text).toContain("unordered nested");
		expect(actual.text).toContain("another nested");
		expect(actual.text).toContain("second ordered");
	});

	test("parses list with formatting inside", () => {
		const input = "1. **bold item**\n2. *italic item*\n3. `code item`";
		const actual = markdownToFormattable(input);
		console.log("Formatted list:", actual.text);
		expect(actual.text).toContain("bold item");
		expect(actual.text).toContain("italic item");
		expect(actual.text).toContain("code item");
		expect(actual.entities.some((e) => e.type === "bold")).toBe(true);
		expect(actual.entities.some((e) => e.type === "italic")).toBe(true);
		expect(actual.entities.some((e) => e.type === "code")).toBe(true);
	});

	test("preserves list position after other content", () => {
		const input =
			"Some text before\n\n1. first item\n2. second item\n\nSome text after";
		const actual = markdownToFormattable(input);
		console.log("List with context:", actual.text);
		expect(actual.text).toContain("Some text before");
		expect(actual.text).toContain("first item");
		expect(actual.text).toContain("second item");
		expect(actual.text).toContain("Some text after");
	});

	test("handles multiple separate lists", () => {
		const input =
			"1. first list item\n2. second list item\n\nSome text\n\n- another list\n- second item";
		const actual = markdownToFormattable(input);
		console.log("Multiple lists:", actual.text);
		expect(actual.text).toContain("first list item");
		expect(actual.text).toContain("second list item");
		expect(actual.text).toContain("Some text");
		expect(actual.text).toContain("another list");
		expect(actual.text).toContain("second item");
	});

	test("regression: ordered list numbering should not increment globally", () => {
		const input =
			"1. first\n2. second\n\nText between\n\n1. new list first\n2. new list second";
		const actual = markdownToFormattable(input);
		expect(actual.text).toContain("1. first");
		expect(actual.text).toContain("2. second");
		expect(actual.text).toContain("1. new list first");
		expect(actual.text).toContain("2. new list second");
		expect(actual.text).not.toContain("3. new list first");
	});

	test("regression: nested lists should preserve their own numbering", () => {
		const input = "1. parent\n   1. child one\n   2. child two\n2. parent two";
		const actual = markdownToFormattable(input);
		expect(actual.text).toContain("1. parent");
		expect(actual.text).toContain("1. child one");
		expect(actual.text).toContain("2. child two");
		expect(actual.text).toContain("2. parent two");
		expect(actual.text).not.toContain("3. child one");
		expect(actual.text).not.toContain("4. child two");
	});

	test("regression: list items should be properly separated", () => {
		const input = "- first\n- second\n- third";
		const actual = markdownToFormattable(input);
		expect(actual.text).toBe("- first\n- second\n- third");
		expect(actual.text).not.toContain("- first- second");
	});

	test("regression: custom start numbers should be preserved", () => {
		const input = "10. tenth\n11. eleventh";
		const actual = markdownToFormattable(input);
		expect(actual.text).toBe("10. tenth\n11. eleventh");
		expect(actual.text).not.toContain("1. tenth");
	});

	test("comprehensive list behavior test", () => {
		const input = `Text before lists

1. First ordered item
2. Second ordered item
   - Nested unordered
   - Another nested
3. Third ordered item

Some text between

5. New ordered list starting at 5
6. Next item

- Unordered list
- Second item
  1. Nested ordered in unordered
  2. Second nested ordered

Text after all lists`;

		const actual = markdownToFormattable(input);

		console.log(actual.text);

		expect(actual.text).toContain("Text before lists");
		expect(actual.text).toContain("1. First ordered item");
		expect(actual.text).toContain("2. Second ordered item");
		expect(actual.text).toContain("- Nested unordered");
		expect(actual.text).toContain("- Another nested");
		expect(actual.text).toContain("3. Third ordered item");
		expect(actual.text).toContain("5. New ordered list starting at 5");
		expect(actual.text).toContain("6. Next item");
		expect(actual.text).toContain("- Unordered list");
		expect(actual.text).toContain("- Second item");
		expect(actual.text).toContain("1. Nested ordered in unordered");
		expect(actual.text).toContain("2. Second nested ordered");
		expect(actual.text).toContain("Text after all lists");

		expect(actual.text).not.toContain("4. New ordered list");
		expect(actual.text).not.toContain("7. Next item");
		expect(actual.text).not.toContain("3. Nested ordered");
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

		expect(actual.text.startsWith("Title")).toBe(true);
		expect(actual.text.includes("\n\n")).toBe(true);
		expect(actual.text).toContain("Title\n\nQuote");
		expect(actual.text).toContain("Quote\n\n- Bold");
		expect(actual.text).toContain("- Bold\n- Italic\n- Link");
		expect(actual.text).toContain("Link\n\nCode");
		expect(actual.text.endsWith("Code")).toBe(true);
	});

	test("Example from the docs", () => {
		const input =
			"Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user";
		const actual = markdownToFormattable(input);

		console.log(actual);

		expect(actual.entities).toEqual([
			{
				type: "text_link",
				offset: 62,
				length: 15,
				url: "https://core.telegram.org/bots/features#inline-keyboards",
			},
			{
				type: "text_link",
				offset: 79,
				length: 21,
				url: "https://core.telegram.org/bots/features#keyboards",
			},
		]);
	});

	describe("invalid cases", () => {
		test("handles unclosed bold", () => {
			const input = "**unclosed bold";
			const actual = markdownToFormattable(input);
			// expect(actual.text).toBe("unclosed bold");
			// expect(actual.entities.some((e) => e.type === "bold")).toBe(true);
		});

		test("handles invalid link syntax", () => {
			const input = "[link without paren";
			const actual = markdownToFormattable(input);
			// expect(actual.text).toBe("link without paren");
			expect(actual.entities).toEqual([]);
		});

		test("handles mixed list types", () => {
			const input = "- item1\n* item2";
			const actual = markdownToFormattable(input);
			// expect(actual.text).toBe("- item1\n* item2");
		});

		test("handles raw HTML", () => {
			const input = "<div>html</div>";
			const actual = markdownToFormattable(input);
			// expect(actual.text).toBe("html");
		});

		test("handles special characters", () => {
			const input = "~!@#$%^&*()_+`";
			const actual = markdownToFormattable(input);
			expect(actual.text).toBe("~!@#$%^&*()_+`");
		});

		test("handles empty input", () => {
			const input = "";
			const actual = markdownToFormattable(input);
			expect(actual.text).toBe("");
			expect(actual.entities).toEqual([]);
		});

		test("handles markdown inside code blocks", () => {
			const input = "```\n**bold in code**\n```";
			const actual = markdownToFormattable(input);
			expect(actual.text).toBe("**bold in code**");
			expect(actual.entities[0].type).toBe("pre");
		});
	});
});
