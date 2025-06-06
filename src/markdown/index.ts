import { type Token, type Tokens, lexer } from "marked";
import {
	type FormattableString,
	blockquote,
	bold,
	code,
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
	const startNumber = isOrdered && typeof tokenList.start === "number" ? tokenList.start : 1;
	
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

// IDK why marked doesn't handle this correctly
function workaroundForHeading(tokens: Token[]): Token[] {
	const result: Token[] = [];

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		result.push(token);
		if (token.type === "heading") {
			const nextLines = token.raw.match(/\n/g);

			if (nextLines?.length) {
				result.push({
					type: "space",
					raw: "\n".repeat(nextLines.length),
				});
			}
		}
	}

	return result;
}

/**
 * ! This function can be changed in the future
 */
export function markdownToFormattable(markdown: string) {
	const tokens = workaroundForHeading(lexer(markdown) as Token[]);

	return join(tokens, processToken, "");
}
