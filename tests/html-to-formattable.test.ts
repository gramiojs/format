import { describe, expect, test } from "bun:test";
import { htmlToFormattable } from "../src/html/index.ts";

describe("htmlToFormattable", () => {
	test("parses plain paragraph text", () => {
		const actual = htmlToFormattable("<p>Hello world</p>");
		expect(actual.text).toBe("Hello world");
		expect(actual.entities).toEqual([]);
	});

	test("parses bold with <strong>", () => {
		const actual = htmlToFormattable("<strong>bold</strong>");
		expect(actual.text).toBe("bold");
		expect(actual.entities[0].type).toBe("bold");
	});

	test("parses bold with <b>", () => {
		const actual = htmlToFormattable("<b>bold</b>");
		expect(actual.text).toBe("bold");
		expect(actual.entities[0].type).toBe("bold");
	});

	test("parses italic with <em>", () => {
		const actual = htmlToFormattable("<em>italic</em>");
		expect(actual.text).toBe("italic");
		expect(actual.entities[0].type).toBe("italic");
	});

	test("parses italic with <i>", () => {
		const actual = htmlToFormattable("<i>italic</i>");
		expect(actual.text).toBe("italic");
		expect(actual.entities[0].type).toBe("italic");
	});

	test("parses underline with <u>", () => {
		const actual = htmlToFormattable("<u>underline</u>");
		expect(actual.text).toBe("underline");
		expect(actual.entities[0].type).toBe("underline");
	});

	test("parses strikethrough with <s>", () => {
		const actual = htmlToFormattable("<s>strike</s>");
		expect(actual.text).toBe("strike");
		expect(actual.entities[0].type).toBe("strikethrough");
	});

	test("parses strikethrough with <del>", () => {
		const actual = htmlToFormattable("<del>strike</del>");
		expect(actual.text).toBe("strike");
		expect(actual.entities[0].type).toBe("strikethrough");
	});

	test("parses inline code with <code>", () => {
		const actual = htmlToFormattable("<code>code</code>");
		expect(actual.text).toBe("code");
		expect(actual.entities[0].type).toBe("code");
	});

	test("parses code block with language", () => {
		const actual = htmlToFormattable(
			'<pre><code class="language-js">console.log(1)</code></pre>',
		);
		expect(actual.text).toBe("console.log(1)");
		expect(actual.entities[0].type).toBe("pre");
		expect(actual.entities[0].language).toBe("js");
	});

	test("parses code block without language", () => {
		const actual = htmlToFormattable(
			"<pre><code>plain code</code></pre>",
		);
		expect(actual.text).toBe("plain code");
		expect(actual.entities[0].type).toBe("pre");
		expect(actual.entities[0].language).toBeUndefined();
	});

	test("parses blockquote", () => {
		const actual = htmlToFormattable("<blockquote><p>quote</p></blockquote>");
		expect(actual.text).toBe("quote");
		expect(actual.entities[0].type).toBe("blockquote");
	});

	test("parses link", () => {
		const actual = htmlToFormattable(
			'<a href="https://example.com">link</a>',
		);
		expect(actual.text).toBe("link");
		expect(actual.entities[0].type).toBe("text_link");
		expect(actual.entities[0].url).toBe("https://example.com");
	});

	test("parses h1 as bold", () => {
		const actual = htmlToFormattable("<h1>Heading</h1>");
		expect(actual.text).toBe("Heading");
		expect(actual.entities[0].type).toBe("bold");
	});

	test("parses h2–h6 as bold", () => {
		for (const level of [2, 3, 4, 5, 6] as const) {
			const actual = htmlToFormattable(`<h${level}>Heading</h${level}>`);
			expect(actual.text).toBe("Heading");
			expect(actual.entities[0].type).toBe("bold");
		}
	});

	test("parses unordered list", () => {
		const actual = htmlToFormattable(
			"<ul><li>item1</li><li>item2</li></ul>",
		);
		expect(actual.text).toBe("- item1\n- item2");
	});

	test("parses ordered list starting at 1", () => {
		const actual = htmlToFormattable(
			"<ol><li>first</li><li>second</li></ol>",
		);
		expect(actual.text).toBe("1. first\n2. second");
	});

	test("parses ordered list with custom start attribute", () => {
		const actual = htmlToFormattable(
			'<ol start="3"><li>third</li><li>fourth</li></ol>',
		);
		expect(actual.text).toBe("3. third\n4. fourth");
	});

	test("parses nested unordered list", () => {
		const actual = htmlToFormattable(
			"<ul><li>item1<ul><li>nested1</li><li>nested2</li></ul></li><li>item2</li></ul>",
		);
		expect(actual.text).toContain("- item1");
		expect(actual.text).toContain("- nested1");
		expect(actual.text).toContain("- nested2");
		expect(actual.text).toContain("- item2");
		expect(actual.text).toContain("\n");
	});

	test("parses nested ordered list with start", () => {
		const actual = htmlToFormattable(
			'<ol><li>first<ol start="5"><li>fifth</li><li>sixth</li></ol></li><li>second</li></ol>',
		);
		expect(actual.text).toContain("1. first");
		expect(actual.text).toContain("5. fifth");
		expect(actual.text).toContain("6. sixth");
		expect(actual.text).toContain("2. second");
	});

	test("parses nested formatting (bold + italic)", () => {
		const actual = htmlToFormattable(
			"<strong><em>bold italic</em></strong>",
		);
		expect(actual.text).toBe("bold italic");
		expect(actual.entities.some((e) => e.type === "bold")).toBe(true);
		expect(actual.entities.some((e) => e.type === "italic")).toBe(true);
	});

	test("parses multiple paragraphs separated by newlines", () => {
		const actual = htmlToFormattable("<p>First</p><p>Second</p>");
		expect(actual.text).toBe("First\n\nSecond");
	});

	test("parses <br> as newline", () => {
		const actual = htmlToFormattable("<p>line1<br>line2</p>");
		expect(actual.text).toBe("line1\nline2");
	});

	test("handles empty input", () => {
		const actual = htmlToFormattable("");
		expect(actual.text).toBe("");
		expect(actual.entities).toEqual([]);
	});

	test("handles HTML entities in text", () => {
		const actual = htmlToFormattable("<p>Hello &amp; World</p>");
		expect(actual.text).toBe("Hello & World");
	});

	test("parses TipTap-style list with <p> wrapper in <li>", () => {
		const actual = htmlToFormattable(
			"<ul><li><p>item1</p></li><li><p>item2</p></li></ul>",
		);
		expect(actual.text).toBe("- item1\n- item2");
	});

	test("parses TipTap-realistic combination", () => {
		const actual = htmlToFormattable(
			"<h1>Title</h1><p><strong>Bold</strong> and <em>italic</em></p><ul><li>item1</li><li>item2</li></ul><p>Footer with <a href=\"https://gramio.dev\">link</a></p>",
		);
		expect(actual.text).toContain("Title");
		expect(actual.text).toContain("Bold and italic");
		expect(actual.text).toContain("- item1\n- item2");
		expect(actual.text).toContain("link");
		expect(actual.entities.some((e) => e.type === "bold")).toBe(true);
		expect(actual.entities.some((e) => e.type === "italic")).toBe(true);
		expect(actual.entities.some((e) => e.type === "text_link")).toBe(true);
		expect(actual.text).toBe(
			"Title\n\nBold and italic\n\n- item1\n- item2\n\nFooter with link",
		);
	});

	test("entities have correct offsets for paragraph with mixed formatting", () => {
		const actual = htmlToFormattable(
			"<p><strong>Hello</strong> world</p>",
		);
		expect(actual.text).toBe("Hello world");
		expect(actual.entities).toEqual([
			{ type: "bold", offset: 0, length: 5 },
		]);
	});

	test("entities have correct offsets across multiple paragraphs", () => {
		const actual = htmlToFormattable(
			"<p>First</p><p><strong>Bold</strong></p>",
		);
		expect(actual.text).toBe("First\n\nBold");
		expect(actual.entities).toEqual([
			{ type: "bold", offset: 7, length: 4 },
		]);
	});
});
