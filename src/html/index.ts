import { parse, type HTMLElement, type Node } from "node-html-parser";
import {
	blockquote,
	bold,
	code,
	type FormattableString,
	format,
	formatSaveIndents,
	italic,
	join,
	link,
	pre,
	strikethrough,
	underline,
} from "../index.ts";

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

function joinChildren(el: HTMLElement): FormattableString {
	const nodes = el.childNodes
		.map(processNode)
		.filter(Boolean) as FormattableString[];
	return join(nodes, (x) => x, "");
}

function processListNode(
	el: HTMLElement,
	ordered: boolean,
	startNumber = 1,
): FormattableString {
	const directItems = el.childNodes.filter(
		(node): node is HTMLElement =>
			node.nodeType === ELEMENT_NODE &&
			(node as HTMLElement).tagName === "LI",
	);

	return join(
		directItems,
		(item, itemIndex) => {
			const bullet = ordered ? `${startNumber + itemIndex}.` : "-";

			// Separate nested lists from other content
			const contentNodes: Node[] = [];
			const nestedListEls: HTMLElement[] = [];

			for (const child of item.childNodes) {
				if (child.nodeType === ELEMENT_NODE) {
					const tag = (child as HTMLElement).tagName;
					if (tag === "UL" || tag === "OL") {
						nestedListEls.push(child as HTMLElement);
						continue;
					}
				}
				contentNodes.push(child);
			}

			const contentParts = contentNodes
				.map(processNode)
				.filter(Boolean) as FormattableString[];
			const content = join(contentParts, (x) => x, "");

			let result: FormattableString = format`${bullet} ${content}`;

			for (const nested of nestedListEls) {
				const isOrdered = nested.tagName === "OL";
				const start = isOrdered
					? Number(nested.getAttribute("start") ?? "1")
					: 1;
				result = format`${result}\n${processListNode(nested, isOrdered, start)}`;
			}

			return result;
		},
		"\n",
	);
}

function processNode(node: Node): FormattableString | null {
	if (node.nodeType === TEXT_NODE) {
		if (!node.rawText.trim()) return null;
		return formatSaveIndents`${node.text}`;
	}

	if (node.nodeType !== ELEMENT_NODE) return null;

	const el = node as HTMLElement;
	const tag = el.tagName;

	switch (tag) {
		case "STRONG":
		case "B":
			return bold(joinChildren(el));

		case "EM":
		case "I":
			return italic(joinChildren(el));

		case "U":
			return underline(joinChildren(el));

		case "S":
		case "DEL":
		case "STRIKE":
			return strikethrough(joinChildren(el));

		case "CODE":
			return code(el.text);

		case "PRE": {
			const codeEl = el.querySelector("code");
			if (codeEl) {
				const classes = codeEl.getAttribute("class") ?? "";
				const langClass = classes
					.split(" ")
					.find((c) => c.startsWith("language-"));
				const lang = langClass?.replace("language-", "");
				return pre(codeEl.text, lang);
			}
			return pre(el.text);
		}

		case "BLOCKQUOTE":
			return blockquote(joinChildren(el));

		case "A": {
			const href = el.getAttribute("href") ?? "";
			return link(joinChildren(el), href);
		}

		case "H1":
		case "H2":
		case "H3":
		case "H4":
		case "H5":
		case "H6":
			return bold(joinChildren(el));

		case "P":
		case "DIV":
			return joinChildren(el);

		case "BR":
			return formatSaveIndents`\n`;

		case "UL":
			return processListNode(el, false);

		case "OL": {
			const start = Number(el.getAttribute("start") ?? "1");
			return processListNode(el, true, start);
		}

		case "LI":
			return joinChildren(el);

		default:
			return joinChildren(el);
	}
}

// Exclude <pre> from blockTextElements so its child <code> is parsed as HTML,
// enabling querySelector("code") and class attribute extraction.
const PARSE_OPTIONS = {
	blockTextElements: { script: true, style: true, noscript: true },
};

/**
 * ! This function can be changed in the future
 */
export function htmlToFormattable(html: string): FormattableString {
	const root = parse(html, PARSE_OPTIONS);
	const children = root.childNodes
		.map(processNode)
		.filter(Boolean) as FormattableString[];
	return join(children, (x) => x, "\n\n");
}
