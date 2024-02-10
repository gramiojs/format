import { ApiMethods } from "@gramio/types";
import { FormattableString } from "./index";

type FormattedMethods = {
	[Method in keyof ApiMethods]?: (
		params: NonNullable<Parameters<ApiMethods[Method]>[0]>,
	) => NonNullable<Parameters<ApiMethods[Method]>[0]>;
};

/** @codegenerated */
export const FormattingMap: FormattedMethods = {
	sendMessage: (params) => {
		if (params.text instanceof FormattableString) params.entities = [];
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		)
			params.reply_parameters.quote_entities = [];
		return params;
	},
	copyMessage: (params) => {
		if (params.caption instanceof FormattableString)
			params.caption_entities = [];
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		)
			params.reply_parameters.quote_entities = [];
		return params;
	},
	sendPhoto: (params) => {
		if (params.caption instanceof FormattableString)
			params.caption_entities = [];
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		)
			params.reply_parameters.quote_entities = [];
		return params;
	},
	sendAudio: (params) => {
		if (params.caption instanceof FormattableString)
			params.caption_entities = [];
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		)
			params.reply_parameters.quote_entities = [];
		return params;
	},
	sendDocument: (params) => {
		if (params.caption instanceof FormattableString)
			params.caption_entities = [];
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		)
			params.reply_parameters.quote_entities = [];
		return params;
	},
	sendVideo: (params) => {
		if (params.caption instanceof FormattableString)
			params.caption_entities = [];
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		)
			params.reply_parameters.quote_entities = [];
		return params;
	},
	sendAnimation: (params) => {
		if (params.caption instanceof FormattableString)
			params.caption_entities = [];
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		)
			params.reply_parameters.quote_entities = [];
		return params;
	},
	sendVoice: (params) => {
		if (params.caption instanceof FormattableString)
			params.caption_entities = [];
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		)
			params.reply_parameters.quote_entities = [];
		return params;
	},
	sendVideoNote: (params) => {
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		)
			params.reply_parameters.quote_entities = [];
		return params;
	},
	sendMediaGroup: (params) => {
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		)
			params.reply_parameters.quote_entities = [];
		return params;
	},
	sendLocation: (params) => {
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		)
			params.reply_parameters.quote_entities = [];
		return params;
	},
	sendVenue: (params) => {
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		)
			params.reply_parameters.quote_entities = [];
		return params;
	},
	sendContact: (params) => {
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		)
			params.reply_parameters.quote_entities = [];
		return params;
	},
	sendPoll: (params) => {
		if (params.explanation instanceof FormattableString)
			params.explanation_entities = [];
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		)
			params.reply_parameters.quote_entities = [];
		return params;
	},
	sendDice: (params) => {
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		)
			params.reply_parameters.quote_entities = [];
		return params;
	},
	editMessageText: (params) => {
		if (params.text instanceof FormattableString) params.entities = [];
		return params;
	},
	editMessageCaption: (params) => {
		if (params.caption instanceof FormattableString)
			params.caption_entities = [];
		return params;
	},
	editMessageMedia: (params) => {
		if (
			params.media !== undefined &&
			"caption" in params.media &&
			params.media.caption instanceof FormattableString
		)
			params.media.caption_entities = [];
		return params;
	},
	sendSticker: (params) => {
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		)
			params.reply_parameters.quote_entities = [];
		return params;
	},
	answerInlineQuery: (params) => {
		if (params.results?.length)
			params.results.map((x) =>
				"caption" in x ? { ...x, caption: "", caption_entities: [] } : x,
			);
		if (params.results?.length)
			params.results.map((x) =>
				"message_text" in x ? { ...x, message_text: "", entities: [] } : x,
			);
		return params;
	},
	answerWebAppQuery: (params) => {
		if (
			params.result !== undefined &&
			"caption" in params.result &&
			params.result.caption instanceof FormattableString
		)
			params.result.caption_entities = [];
		if (
			"input_message_content" in params.result &&
			params.result.input_message_content !== undefined &&
			"message_text" in params.result.input_message_content &&
			params.result.input_message_content.message_text instanceof
				FormattableString
		)
			params.result.input_message_content.entities = [];
		return params;
	},
	sendInvoice: (params) => {
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		)
			params.reply_parameters.quote_entities = [];
		return params;
	},
	sendGame: (params) => {
		if (
			params.reply_parameters !== undefined &&
			"quote" in params.reply_parameters &&
			params.reply_parameters.quote instanceof FormattableString
		)
			params.reply_parameters.quote_entities = [];
		return params;
	},
};
