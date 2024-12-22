import type { APIMethodParams, APIMethods } from "@gramio/types";
import { FormattableString } from "./formattable-string.js";

type FormattableMethods = {
	[Method in keyof APIMethods]?: (
		params: NonNullable<APIMethodParams<Method>>,
	) => NonNullable<APIMethodParams<Method>>;
};

/**
 * A set of methods that decompose the {@link FormattableString} into a string and
 * an array of [entities](https://core.telegram.org/bots/api#messageentity) for further sending to the Telegram Bot API
 *
 * @codegenerated
 */
export const FormattableMap: FormattableMethods = {
	sendMessage: (params) => {
		if (params.text instanceof FormattableString) {
			params.entities = params.text.entities;
			params.text = params.text.text;
		}
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	copyMessage: (params) => {
		if (params.caption instanceof FormattableString) {
			params.caption_entities = params.caption.entities;
			params.caption = params.caption.text;
		}
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	sendPhoto: (params) => {
		if (params.caption instanceof FormattableString) {
			params.caption_entities = params.caption.entities;
			params.caption = params.caption.text;
		}
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	sendAudio: (params) => {
		if (params.caption instanceof FormattableString) {
			params.caption_entities = params.caption.entities;
			params.caption = params.caption.text;
		}
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	sendDocument: (params) => {
		if (params.caption instanceof FormattableString) {
			params.caption_entities = params.caption.entities;
			params.caption = params.caption.text;
		}
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	sendVideo: (params) => {
		if (params.caption instanceof FormattableString) {
			params.caption_entities = params.caption.entities;
			params.caption = params.caption.text;
		}
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	sendAnimation: (params) => {
		if (params.caption instanceof FormattableString) {
			params.caption_entities = params.caption.entities;
			params.caption = params.caption.text;
		}
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	sendVoice: (params) => {
		if (params.caption instanceof FormattableString) {
			params.caption_entities = params.caption.entities;
			params.caption = params.caption.text;
		}
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	sendVideoNote: (params) => {
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	sendMediaGroup: (params) => {
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}

		// TODO: TEMPORAL FIX FIND ISSUE
		if (params.media.length)
			params.media = params.media.map((x) =>
				"caption" in x && x.caption instanceof FormattableString
					? {
							...x,
							caption: x.caption.text,
							caption_entities: x.caption.entities,
						}
					: x,
			);

		return params;
	},
	sendLocation: (params) => {
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	sendVenue: (params) => {
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	sendContact: (params) => {
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	sendPoll: (params) => {
		if (params.question instanceof FormattableString) {
			params.question_entities = params.question.entities;
			params.question = params.question.text;
		}
		if (params.explanation instanceof FormattableString) {
			params.explanation_entities = params.explanation.entities;
			params.explanation = params.explanation.text;
		}
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		if (params.options.length)
			params.options = params.options.map((x) =>
				"text" in x && x.text instanceof FormattableString
					? { ...x, text: x.text.text, text_entities: x.text.entities }
					: x,
			);

		return params;
	},
	sendDice: (params) => {
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	editMessageText: (params) => {
		if (params.text instanceof FormattableString) {
			params.entities = params.text.entities;
			params.text = params.text.text;
		}
		return params;
	},
	editMessageCaption: (params) => {
		if (params.caption instanceof FormattableString) {
			params.caption_entities = params.caption.entities;
			params.caption = params.caption.text;
		}
		return params;
	},
	editMessageMedia: (params) => {
		if (
			params.media !== undefined &&
			"caption" in params.media &&
			params.media.caption instanceof FormattableString
		) {
			params.media.caption_entities = params.media.caption.entities;
			params.media.caption = params.media.caption.text;
		}
		return params;
	},
	sendSticker: (params) => {
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	// TODO: fix
	answerInlineQuery: (params) => {
		if (params.results?.length)
			params.results = params.results.map((x) =>
				"caption" in x && x.caption instanceof FormattableString
					? {
							...x,
							caption: x.caption.text,
							caption_entities: x.caption.entities,
						}
					: x,
			);
		// TODO: fix this in generator
		if (params.results?.length)
			params.results = params.results.map((x) =>
				"input_message_content" in x &&
				x.input_message_content &&
				"message_text" in x.input_message_content &&
				x.input_message_content.message_text instanceof FormattableString
					? {
							...x,
							input_message_content: {
								...x.input_message_content,
								message_text: x.input_message_content.message_text.text,
								entities: x.input_message_content.message_text.entities,
							},
						}
					: x,
			);
		return params;
	},
	savePreparedInlineMessage: (params) => {
		if (
			"caption" in params.result &&
			params.result.caption instanceof FormattableString
		) {
			params.result.caption_entities = params.result.caption.entities;
			params.result.caption = params.result.caption.text;
		}
		if (
			"input_message_content" in params.result &&
			params.result.input_message_content &&
			"message_text" in params.result.input_message_content &&
			params.result.input_message_content.message_text instanceof
				FormattableString
		) {
			params.result = {
				...params.result,
				input_message_content: {
					...params.result.input_message_content,
					message_text: params.result.input_message_content.message_text.text,
					entities: params.result.input_message_content.message_text.entities,
				},
			};
		}

		return params;
	},
	sendGift: (params) => {
		if (params.text instanceof FormattableString) {
			params.text_entities = params.text.entities;
			params.text = params.text.text;
		}

		return params;
	},
	answerWebAppQuery: (params) => {
		if (
			params.result !== undefined &&
			"caption" in params.result &&
			params.result.caption instanceof FormattableString
		) {
			params.result.caption_entities = params.result.caption.entities;
			params.result.caption = params.result.caption.text;
		}
		if (
			"input_message_content" in params.result &&
			params.result.input_message_content !== undefined &&
			"message_text" in params.result.input_message_content &&
			params.result.input_message_content.message_text instanceof
				FormattableString
		) {
			params.result.input_message_content.entities =
				params.result.input_message_content.message_text.entities;
			params.result.input_message_content.message_text =
				params.result.input_message_content.message_text.text;
		}
		return params;
	},
	sendInvoice: (params) => {
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	sendGame: (params) => {
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
};
