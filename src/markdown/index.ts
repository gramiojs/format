import { lexer, type Token, type Tokens } from "marked";
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
} from "../index.ts";

function processToken(token: Token): FormattableString {
	if (token.type === "blockquote") {
		const tokenBlockquote = token as Tokens.Blockquote;

		return blockquote(join(tokenBlockquote.tokens, processToken, ""));
	}

	if (token.type === "strong" || token.type === "heading") {
		const tokenStrong = token as Tokens.Strong | Tokens.Heading;

		return bold(join(tokenStrong.tokens, processToken, ""));
	}

	if (token.type === "em") {
		const tokenEm = token as Tokens.Em;

		return italic(join(tokenEm.tokens, processToken, ""));
	}

	if (token.type === "link" || token.type === "image") {
		const tokenLink = token as Tokens.Link | Tokens.Image;

		return link(join(tokenLink.tokens, processToken, ""), tokenLink.href);
	}

	if (token.type === "del") {
		const tokenDel = token as Tokens.Del;

		return strikethrough(join(tokenDel.tokens, processToken, ""));
	}

	if (token.type === "list") {
		const tokenList = token as Tokens.List;

		return processListToken(tokenList);
	}

	if (token.type === "codespan") {
		const tokenCodespan = token as Tokens.Codespan;

		return code(tokenCodespan.text);
	}

	if (token.type === "code") {
		const tokenCode = token as Tokens.Code;

		return pre(tokenCode.text, tokenCode.lang);
	}

	if (token.type === "text") {
		const tokenText = token as Tokens.Text;

		return tokenText.tokens
			? join(tokenText.tokens, processToken, "")
			: formatSaveIndents`${tokenText.text}`;
	}

	if (token.type === "paragraph") {
		const tokenParagraph = token as Tokens.Paragraph;

		return join(tokenParagraph.tokens, processToken, "");
	}

	// console.error(token);

	return formatSaveIndents`${"text" in token ? token.text : token.raw}`;
}

function processListToken(tokenList: Tokens.List): FormattableString {
	const isOrdered = tokenList.ordered;
	const startNumber =
		isOrdered && typeof tokenList.start === "number" ? tokenList.start : 1;

	return join(
		tokenList.items,
		(item, itemIndex) => {
			const bulletOrNumber = isOrdered ? startNumber + itemIndex : "-";

			return join(
				item.tokens,
				(subToken, subTokenIndex) => {
					if (subTokenIndex === 0) {
						return format`${bulletOrNumber}${isOrdered ? "." : ""} ${processToken(subToken)}`;
					}
					if (subToken.type === "list") {
						return format`\n${processToken(subToken)}`;
					}
					return processToken(subToken);
				},
				"",
			);
		},
		"\n",
	);
}

/**
 * Insert synthetic `space` tokens between adjacent block tokens so
 * the rendered output preserves the original newline separation.
 *
 * Marked stores a block's trailing newlines on its own `raw` field
 * (e.g. a paragraph followed by a list without a blank line yields
 * `paragraph.raw === "Agenda:\n"`, then a `list` token). But
 * `processToken` works off the structured `tokens`/`text` fields
 * and drops that trailing whitespace. Without this normalisation,
 * two adjacent blocks get glued together in the output:
 *
 *   Input:   "Agenda:\n- one\n- two"
 *   Broken:  "Agenda:- one\n- two"
 *   Fixed:   "Agenda:\n- one\n- two"
 *
 * Strategy: for each block, if the next token is not already a
 * `space` (i.e. marked did not record a blank-line separator) and
 * the current block's `raw` has trailing `\n`s, emit a synthetic
 * `space` token carrying exactly those newlines.
 *
 * This generalises the older heading-only workaround — headings
 * are covered by the same trailing-newline count logic.
 */
function normalizeBlockSeparators(tokens: Token[]): Token[] {
	const result: Token[] = [];

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		result.push(token);

		// `space` tokens already carry their own newlines in `raw` —
		// `processToken`'s default branch returns that raw as-is, so
		// re-emitting trailing newlines around them would double-count.
		if (token.type === "space") continue;

		const next = tokens[i + 1];
		if (!next || next.type === "space") continue;

		const trailing = token.raw?.match(/\n+$/)?.[0];
		if (trailing) {
			result.push({
				type: "space",
				raw: trailing,
			});
		}
	}

	return result;
}

/**
 * ! This function can be changed in the future
 */
export function markdownToFormattable(markdown: string) {
	const tokens = normalizeBlockSeparators(lexer(markdown) as Token[]);

	return join(tokens, processToken, "");
}
