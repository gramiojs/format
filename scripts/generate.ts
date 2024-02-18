import fs from "node:fs/promises";
import prettier from "prettier";
import { IBotApi } from "./types";

const SCHEMA_FILE_PATH = "./tg-bot-api/public/dev/custom.min.json";

const schemaFile = await fs.readFile(SCHEMA_FILE_PATH);
const schema = JSON.parse(String(schemaFile)) as IBotApi.ISchema;

function resolveReference(name: string) {
	const telegramObject = schema.objects.find((x) => x.name === name);

	if (!telegramObject) return [false, false] as const;
	return [
		(telegramObject?.properties ||
			telegramObject.any_of) as IBotApi.IArgument[],
		"properties" in telegramObject ? "properties" : "any_of",
	] as const;
}

function findFormattingInArguments(methodArguments: IBotApi.IArgument[]) {
	const paths: {
		text?: string;
		entities?: string;
		type?: "array" | "union" | "union-array";
		property?: string;
	}[] = [];
	if (
		methodArguments.some(
			(x) =>
				x.description?.includes("after entities parsing") ||
				x.name === "message_text",
		)
	)
		paths.push({});

	for (const argument of methodArguments) {
		if (argument.array?.reference === "MessageEntity")
			paths[0].entities = argument.name;

		if (
			argument?.description?.includes("after entities parsing") ||
			argument.name === "message_text"
		)
			paths[0].text = argument.name;

		if (argument.reference) {
			const [referenceArguments, type] = resolveReference(argument.reference);
			if (!referenceArguments) continue;

			const formatting = findFormattingInArguments(referenceArguments);
			if (!formatting.length) continue;

			paths.push(
				...formatting.map((x) => ({
					...x,
					type: type === "any_of" ? ("union" as const) : undefined,
					property: argument.name,
				})),
			);
		}

		if (argument.array)
			paths.push(
				...findFormattingInArguments([argument.array]).map(
					(x) =>
						({
							...x,
							type: x.type ? "union-array" : "array",
							property: argument.name,
						}) as const,
				),
			);
	}

	return paths;
}

const methods: Record<
	string,
	ReturnType<typeof findFormattingInArguments>
> = {};

for (const method of schema.methods) {
	if (!method.arguments) continue;

	const paths = findFormattingInArguments(method.arguments);
	if (paths.length)
		methods[method.name] = [
			...new Map(
				paths.map((item) => [`${item.text}${item.property}`, item]),
			).values(),
		];
}

// TODO: IMPROVE MANY IMPROVES
function mutateLogic(
	argument: ReturnType<typeof findFormattingInArguments>[0],
) {
	if (argument.text === "message_text" && argument.property === "result")
		return `if (
		"input_message_content" in params.result &&
		params.result.input_message_content !== undefined && 
		"message_text" in params.result.input_message_content &&
		params.result.input_message_content.message_text instanceof FormattableString
	) {
		params.result.input_message_content.entities = params.result.input_message_content.message_text.entities; 
		params.result.input_message_content.message_text = params.result.input_message_content.message_text.text;
	}`;
	if (!argument.type && !argument.property)
		return `if(params.${argument.text} instanceof FormattableString) {
	params.${argument.entities} = params.${argument.text}.entities;
	params.${argument.text} = params.${argument.text}.text;
}`;
	if (!argument.type || argument.type === "union")
		return `if(params.${argument.property} !== undefined && "${argument.text}" in params.${argument.property} && params.${argument.property}.${argument.text} instanceof FormattableString) {
	params.${argument.property}.${argument.entities} = params.${argument.property}.${argument.text}.entities;
	params.${argument.property}.${argument.text} = params.${argument.property}.${argument.text}.text;
		}`;
	if (argument.type === "array")
		return `if(params.${argument.property}?.length) params.${argument.property}.map(x => (x.${argument.text} instanceof FormattableString ? {...x, ${argument.text}: x.${argument.text}.text, ${argument.entities}: x.${argument.text}.entities} : x))`;
	if (argument.type === "union-array")
		return `if(params.${argument.property}?.length) params.${argument.property}.map(x => ("${argument.text}" in x && x.${argument.text} instanceof FormattableString ? {...x, ${argument.entities}: x.${argument.text}.entities} : x))`;
}
console.log(methods);
fs.writeFile(
	"./src/mutator.ts",
	await prettier.format(
		/* ts */ `import { ApiMethods } from "@gramio/types";
		import { FormattableString } from "./index";

    type FormattableMethods = {
        [Method in keyof ApiMethods]?: (params: (NonNullable<
            Parameters<ApiMethods[Method]>[0]
        >)) => (NonNullable<
            Parameters<ApiMethods[Method]>[0]
        >);
    };

    /** @codegenerated */
    export const FormattableMap: FormattableMethods = {
		${Object.entries(methods)
			.map(([key, value]) => {
				return `${key}: (params) => {${value
					.map(mutateLogic)
					.join("\n")}; return params; },`;
			})
			.join("\n")}
        }`,
		{ tabWidth: 4, parser: "typescript", endOfLine: "auto", semi: false },
	),
);
