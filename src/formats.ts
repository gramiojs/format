import { ApiMethods } from "@gramio/types"

type FormattedMethods = {
    [Method in keyof ApiMethods]?: (
        params: NonNullable<Parameters<ApiMethods[Method]>[0]>,
    ) => NonNullable<Parameters<ApiMethods[Method]>[0]>
}

/** @codegenerated */
export const FormattingMap: FormattedMethods = {
    sendMessage: (params) => {
        if ("text" in params) params.entities = []
        if (
            params.reply_parameters !== undefined &&
            "quote" in params.reply_parameters
        )
            params.reply_parameters.quote_entities = []
        return params
    },
    copyMessage: (params) => {
        if ("caption" in params) params.caption_entities = []
        if (
            params.reply_parameters !== undefined &&
            "quote" in params.reply_parameters
        )
            params.reply_parameters.quote_entities = []
        return params
    },
    sendPhoto: (params) => {
        if ("caption" in params) params.caption_entities = []
        if (
            params.reply_parameters !== undefined &&
            "quote" in params.reply_parameters
        )
            params.reply_parameters.quote_entities = []
        return params
    },
    sendAudio: (params) => {
        if ("caption" in params) params.caption_entities = []
        if (
            params.reply_parameters !== undefined &&
            "quote" in params.reply_parameters
        )
            params.reply_parameters.quote_entities = []
        return params
    },
    sendDocument: (params) => {
        if ("caption" in params) params.caption_entities = []
        if (
            params.reply_parameters !== undefined &&
            "quote" in params.reply_parameters
        )
            params.reply_parameters.quote_entities = []
        return params
    },
    sendVideo: (params) => {
        if ("caption" in params) params.caption_entities = []
        if (
            params.reply_parameters !== undefined &&
            "quote" in params.reply_parameters
        )
            params.reply_parameters.quote_entities = []
        return params
    },
    sendAnimation: (params) => {
        if ("caption" in params) params.caption_entities = []
        if (
            params.reply_parameters !== undefined &&
            "quote" in params.reply_parameters
        )
            params.reply_parameters.quote_entities = []
        return params
    },
    sendVoice: (params) => {
        if ("caption" in params) params.caption_entities = []
        if (
            params.reply_parameters !== undefined &&
            "quote" in params.reply_parameters
        )
            params.reply_parameters.quote_entities = []
        return params
    },
    sendVideoNote: (params) => {
        if (
            params.reply_parameters !== undefined &&
            "quote" in params.reply_parameters
        )
            params.reply_parameters.quote_entities = []
        return params
    },
    sendMediaGroup: (params) => {
        if (
            params.reply_parameters !== undefined &&
            "quote" in params.reply_parameters
        )
            params.reply_parameters.quote_entities = []
        return params
    },
    sendLocation: (params) => {
        if (
            params.reply_parameters !== undefined &&
            "quote" in params.reply_parameters
        )
            params.reply_parameters.quote_entities = []
        return params
    },
    sendVenue: (params) => {
        if (
            params.reply_parameters !== undefined &&
            "quote" in params.reply_parameters
        )
            params.reply_parameters.quote_entities = []
        return params
    },
    sendContact: (params) => {
        if (
            params.reply_parameters !== undefined &&
            "quote" in params.reply_parameters
        )
            params.reply_parameters.quote_entities = []
        return params
    },
    sendPoll: (params) => {
        if ("explanation" in params) params.explanation_entities = []
        if (
            params.reply_parameters !== undefined &&
            "quote" in params.reply_parameters
        )
            params.reply_parameters.quote_entities = []
        return params
    },
    sendDice: (params) => {
        if (
            params.reply_parameters !== undefined &&
            "quote" in params.reply_parameters
        )
            params.reply_parameters.quote_entities = []
        return params
    },
    editMessageText: (params) => {
        if ("text" in params) params.entities = []
        return params
    },
    editMessageCaption: (params) => {
        if ("caption" in params) params.caption_entities = []
        return params
    },
    editMessageMedia: (params) => {
        if (params.media !== undefined && "caption" in params.media)
            params.media.caption_entities = []
        return params
    },
    sendSticker: (params) => {
        if (
            params.reply_parameters !== undefined &&
            "quote" in params.reply_parameters
        )
            params.reply_parameters.quote_entities = []
        return params
    },
    answerInlineQuery: (params) => {
        if (params.results?.length)
            params.results.map((x) =>
                "caption" in x
                    ? { ...x, caption: "", caption_entities: [] }
                    : x,
            )
        if (params.results?.length)
            params.results.map((x) =>
                "message_text" in x
                    ? { ...x, message_text: "", entities: [] }
                    : x,
            )
        return params
    },
    answerWebAppQuery: (params) => {
        if (params.result !== undefined && "caption" in params.result)
            params.result.caption_entities = []
        if (
            "input_message_content" in params.result &&
            params.result.input_message_content !== undefined &&
            "message_text" in params.result.input_message_content
        )
            params.result.input_message_content.entities = []
        return params
    },
    sendInvoice: (params) => {
        if (
            params.reply_parameters !== undefined &&
            "quote" in params.reply_parameters
        )
            params.reply_parameters.quote_entities = []
        return params
    },
    sendGame: (params) => {
        if (
            params.reply_parameters !== undefined &&
            "quote" in params.reply_parameters
        )
            params.reply_parameters.quote_entities = []
        return params
    },
}
