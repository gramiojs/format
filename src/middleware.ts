import type { APIMethodParams, APIMethods } from "@gramio/types";
import { FormattableMap } from "./mutator.js";

type MiddlewareContext = {
	[M in keyof APIMethods]: {
		method: M;
		params: APIMethodParams<M>;
		formData?: FormData;
	};
}[keyof APIMethods];

/**
 * Middleware that automatically decomposes {@link FormattableString} values in API params
 * into plain text + entities, making them ready for the Telegram Bot API.
 *
 * @example
 * ```ts
 * import { Telegram } from "wrappergram";
 * import { formatMiddleware } from "@gramio/format/middleware";
 * import { format, bold, italic } from "@gramio/format";
 *
 * const telegram = new Telegram("BOT_TOKEN", {
 *     middlewares: [formatMiddleware],
 * });
 *
 * await telegram.api.sendMessage({
 *     chat_id: 123,
 *     text: format`Hello ${bold`world`}!`,
 * });
 * ```
 */
export const formatMiddleware = (
	context: MiddlewareContext,
	next: () => Promise<unknown>,
): Promise<unknown> => {
	// @ts-expect-error: correlated union — method and params are always in sync at runtime
	FormattableMap[context.method]?.(context.params);

	return next();
};
