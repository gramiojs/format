import type { APIMethodParams, APIMethods } from "@gramio/types";
import { FormattableString } from "./formattable-string.js";

const isFormattableString = (value: unknown): value is FormattableString =>
	FormattableString[Symbol.hasInstance](value);

type FormattableMethods = {
	[Method in keyof APIMethods]?: (
		params: NonNullable<APIMethodParams<Method>>,
	) => NonNullable<APIMethodParams<Method>>;
};

/**
 * A set of methods that decompose the {@link FormattableString} into a string and
 * an array of [entities](https://core.telegram.org/bots/api#messageentity) for further sending to the Telegram Bot API
 *
 * @codegenerated from Telegram Bot API 9.6
 */
export const FormattableMap: FormattableMethods = {
	sendMessage: (params) => {
		if (isFormattableString(params.text)) {
			params.entities = params.text.entities;
			params.text = params.text.text;
		}
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			isFormattableString(params.reply_parameters.quote)
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	copyMessage: (params) => {
		if (isFormattableString(params.caption)) {
			params.caption_entities = params.caption.entities;
			params.caption = params.caption.text;
		}
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			isFormattableString(params.reply_parameters.quote)
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	sendPhoto: (params) => {
		if (isFormattableString(params.caption)) {
			params.caption_entities = params.caption.entities;
			params.caption = params.caption.text;
		}
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			isFormattableString(params.reply_parameters.quote)
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	sendAudio: (params) => {
		if (isFormattableString(params.caption)) {
			params.caption_entities = params.caption.entities;
			params.caption = params.caption.text;
		}
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			isFormattableString(params.reply_parameters.quote)
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	sendDocument: (params) => {
		if (isFormattableString(params.caption)) {
			params.caption_entities = params.caption.entities;
			params.caption = params.caption.text;
		}
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			isFormattableString(params.reply_parameters.quote)
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	sendVideo: (params) => {
		if (isFormattableString(params.caption)) {
			params.caption_entities = params.caption.entities;
			params.caption = params.caption.text;
		}
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			isFormattableString(params.reply_parameters.quote)
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	sendAnimation: (params) => {
		if (isFormattableString(params.caption)) {
			params.caption_entities = params.caption.entities;
			params.caption = params.caption.text;
		}
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			isFormattableString(params.reply_parameters.quote)
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	sendVoice: (params) => {
		if (isFormattableString(params.caption)) {
			params.caption_entities = params.caption.entities;
			params.caption = params.caption.text;
		}
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			isFormattableString(params.reply_parameters.quote)
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
			isFormattableString(params.reply_parameters.quote)
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	sendPaidMedia: (params) => {
		if (isFormattableString(params.caption)) {
			params.caption_entities = params.caption.entities;
			params.caption = params.caption.text;
		}
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			isFormattableString(params.reply_parameters.quote)
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
			isFormattableString(params.reply_parameters.quote)
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		if (params.media.length)
			params.media = params.media.map((x) =>
				"caption" in x && isFormattableString(x.caption)
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
			isFormattableString(params.reply_parameters.quote)
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
			isFormattableString(params.reply_parameters.quote)
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
			isFormattableString(params.reply_parameters.quote)
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	sendPoll: (params) => {
		if (isFormattableString(params.question)) {
			params.question_entities = params.question.entities;
			params.question = params.question.text;
		}
		if (isFormattableString(params.explanation)) {
			params.explanation_entities = params.explanation.entities;
			params.explanation = params.explanation.text;
		}
		if (isFormattableString(params.description)) {
			params.description_entities = params.description.entities;
			params.description = params.description.text;
		}
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			isFormattableString(params.reply_parameters.quote)
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		if (params.options.length)
			params.options = params.options.map((x) =>
				"text" in x && isFormattableString(x.text)
					? {
							...x,
							text: x.text.text,
							text_entities: x.text.entities,
						}
					: x,
			);
		return params;
	},
	sendChecklist: (params) => {
		if (isFormattableString(params.checklist.title)) {
			params.checklist.title_entities = params.checklist.title.entities;
			params.checklist.title = params.checklist.title.text;
		}
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			isFormattableString(params.reply_parameters.quote)
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		if (params.checklist.tasks.length)
			params.checklist.tasks = params.checklist.tasks.map((x) =>
				"text" in x && isFormattableString(x.text)
					? {
							...x,
							text: x.text.text,
							text_entities: x.text.entities,
						}
					: x,
			);
		return params;
	},
	sendDice: (params) => {
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			isFormattableString(params.reply_parameters.quote)
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	sendMessageDraft: (params) => {
		if (isFormattableString(params.text)) {
			params.entities = params.text.entities;
			params.text = params.text.text;
		}
		return params;
	},
	sendGift: (params) => {
		if (isFormattableString(params.text)) {
			params.text_entities = params.text.entities;
			params.text = params.text.text;
		}
		return params;
	},
	giftPremiumSubscription: (params) => {
		if (isFormattableString(params.text)) {
			params.text_entities = params.text.entities;
			params.text = params.text.text;
		}
		return params;
	},
	postStory: (params) => {
		if (isFormattableString(params.caption)) {
			params.caption_entities = params.caption.entities;
			params.caption = params.caption.text;
		}
		return params;
	},
	editStory: (params) => {
		if (isFormattableString(params.caption)) {
			params.caption_entities = params.caption.entities;
			params.caption = params.caption.text;
		}
		return params;
	},
	answerWebAppQuery: (params) => {
		if (
			"caption" in params.result &&
			isFormattableString(params.result.caption)
		) {
			params.result.caption_entities = params.result.caption.entities;
			params.result.caption = params.result.caption.text;
		}
		if (
			"input_message_content" in params.result &&
			params.result.input_message_content !== undefined &&
			"message_text" in params.result.input_message_content &&
			isFormattableString(
				params.result.input_message_content.message_text,
			)
		) {
			params.result.input_message_content.entities =
				params.result.input_message_content.message_text.entities;
			params.result.input_message_content.message_text =
				params.result.input_message_content.message_text.text;
		}
		return params;
	},
	savePreparedInlineMessage: (params) => {
		if (
			"caption" in params.result &&
			isFormattableString(params.result.caption)
		) {
			params.result.caption_entities = params.result.caption.entities;
			params.result.caption = params.result.caption.text;
		}
		if (
			"input_message_content" in params.result &&
			params.result.input_message_content !== undefined &&
			"message_text" in params.result.input_message_content &&
			isFormattableString(
				params.result.input_message_content.message_text,
			)
		) {
			params.result.input_message_content.entities =
				params.result.input_message_content.message_text.entities;
			params.result.input_message_content.message_text =
				params.result.input_message_content.message_text.text;
		}
		return params;
	},
	editMessageText: (params) => {
		if (isFormattableString(params.text)) {
			params.entities = params.text.entities;
			params.text = params.text.text;
		}
		return params;
	},
	editMessageCaption: (params) => {
		if (isFormattableString(params.caption)) {
			params.caption_entities = params.caption.entities;
			params.caption = params.caption.text;
		}
		return params;
	},
	editMessageMedia: (params) => {
		if (
			"caption" in params.media &&
			isFormattableString(params.media.caption)
		) {
			params.media.caption_entities = params.media.caption.entities;
			params.media.caption = params.media.caption.text;
		}
		return params;
	},
	editMessageChecklist: (params) => {
		if (isFormattableString(params.checklist.title)) {
			params.checklist.title_entities = params.checklist.title.entities;
			params.checklist.title = params.checklist.title.text;
		}
		if (params.checklist.tasks.length)
			params.checklist.tasks = params.checklist.tasks.map((x) =>
				"text" in x && isFormattableString(x.text)
					? {
							...x,
							text: x.text.text,
							text_entities: x.text.entities,
						}
					: x,
			);
		return params;
	},
	sendSticker: (params) => {
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			isFormattableString(params.reply_parameters.quote)
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
	answerInlineQuery: (params) => {
		if (params.results.length)
			params.results = params.results.map((x) =>
				"caption" in x && isFormattableString(x.caption)
					? {
							...x,
							caption: x.caption.text,
							caption_entities: x.caption.entities,
						}
					: x,
			);
		if (params.results.length)
			params.results = params.results.map((x) =>
				"input_message_content" in x &&
				x.input_message_content !== undefined &&
				"message_text" in x.input_message_content &&
				isFormattableString(x.input_message_content.message_text)
					? {
							...x,
							input_message_content: {
								...x.input_message_content,
								message_text:
									x.input_message_content.message_text.text,
								entities:
									x.input_message_content.message_text
										.entities,
							},
						}
					: x,
			);
		return params;
	},
	sendInvoice: (params) => {
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			isFormattableString(params.reply_parameters.quote)
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
			isFormattableString(params.reply_parameters.quote)
		) {
			params.reply_parameters.quote_entities =
				params.reply_parameters.quote.entities;
			params.reply_parameters.quote = params.reply_parameters.quote.text;
		}
		return params;
	},
};
