import fs from "node:fs/promises";
import {
	type Field,
	getCustomSchema,
	type Object as ApiObject,
} from "@gramio/schema-parser";
import prettier from "prettier";

const OUTPUT = "./src/mutator.ts";

const schema = await getCustomSchema();

// Fallback for @gramio/schema-parser < 1.1.0, which didn't detect the bare
// `parse_mode` + `entities` sibling pattern used by InputTextMessageContent.
// Idempotent: skips fields already marked by newer parser versions.
for (const obj of schema.objects) {
	if (obj.type !== "fields") continue;
	const keys = new Set(obj.fields.map((f) => f.key));
	if (!keys.has("parse_mode") || !keys.has("entities")) continue;
	const candidates = obj.fields.filter(
		(f) => f.type === "string" && f.key !== "parse_mode" && !f.semanticType,
	);
	if (candidates.length === 1) candidates[0].semanticType = "formattable";
}

const objectByName = new Map(schema.objects.map((o) => [o.name, o]));

type Access = {
	key: string;
	/** emit `"key" in parent` — parent of this access is a union variant */
	inCheck: boolean;
	/** field is optional — emit `parent.key !== undefined` when we continue past */
	childOptional: boolean;
};

type Transform = {
	/** Outer path from `params` to the enclosing array, or `null` when not inside an array. */
	arrayPath: Access[] | null;
	/** Steps from the current scope root (`params` or `x`) to the parent of the leaf. */
	innerPath: Access[];
	textKey: string;
	entitiesKey: string;
	/** Emit `"textKey" in parent` at the leaf (optional field or union-variant parent). */
	inCheckLeaf: boolean;
};

type WalkState = {
	path: Access[];
	parentIsUnion: boolean;
	visited: Set<string>;
	arrayPath: Access[] | null;
};

function walkFields(fields: Field[], state: WalkState, out: Transform[]) {
	for (const field of fields) {
		walkField(field, fields, state, out);
	}
}

function walkField(
	field: Field,
	siblings: Field[],
	state: WalkState,
	out: Transform[],
) {
	if (field.type === "string" && field.semanticType === "formattable") {
		const entitiesKey = findEntitiesSibling(siblings, field.key);
		if (!entitiesKey) return;
		// At the leaf, emit `"textKey" in parent` only when we're nested
		// beneath `params` and the text field is either optional or lives on
		// a union variant. Direct `params.text` access never needs the guard.
		const nested = state.path.length > 0 || state.arrayPath !== null;
		const inCheckLeaf =
			nested && (state.parentIsUnion || field.required === false);
		out.push({
			arrayPath: state.arrayPath,
			innerPath: [...state.path],
			textKey: field.key,
			entitiesKey,
			inCheckLeaf,
		});
		return;
	}

	if (field.type === "reference") {
		const obj = objectByName.get(field.reference.name);
		if (!obj) return;
		if (obj.type === "fields") {
			stepInto(field, obj, obj.fields, false, state, out);
		} else if (obj.type === "oneOf") {
			for (const variant of obj.oneOf) {
				stepIntoOneOfVariant(field, variant, state, out);
			}
		}
		return;
	}

	if (field.type === "array") {
		if (state.arrayPath !== null) return; // nested arrays not handled
		const arrayAccess: Access = {
			key: field.key,
			inCheck: state.parentIsUnion,
			childOptional: field.required === false,
		};
		const innerState: WalkState = {
			path: [],
			parentIsUnion: false,
			visited: new Set(state.visited),
			arrayPath: [...state.path, arrayAccess],
		};
		walkArrayItem(field.arrayOf, innerState, out);
		return;
	}

	if (field.type === "one_of") {
		for (const variant of field.variants) {
			stepIntoOneOfVariant(field, variant, state, out);
		}
	}
}

function walkArrayItem(item: Field, state: WalkState, out: Transform[]) {
	if (item.type === "reference") {
		const obj = objectByName.get(item.reference.name);
		if (!obj) return;
		if (obj.type === "fields") {
			if (state.visited.has(obj.name)) return;
			walkFields(
				obj.fields,
				{ ...state, visited: new Set([...state.visited, obj.name]) },
				out,
			);
		} else if (obj.type === "oneOf") {
			for (const variant of obj.oneOf) walkUnionVariant(variant, state, out);
		}
		return;
	}
	if (item.type === "one_of") {
		for (const variant of item.variants) walkUnionVariant(variant, state, out);
	}
}

function walkUnionVariant(variant: Field, state: WalkState, out: Transform[]) {
	if (variant.type !== "reference") return;
	const vObj = objectByName.get(variant.reference.name);
	if (!vObj || vObj.type !== "fields") return;
	if (state.visited.has(vObj.name)) return;
	walkFields(
		vObj.fields,
		{
			...state,
			parentIsUnion: true,
			visited: new Set([...state.visited, vObj.name]),
		},
		out,
	);
}

function stepInto(
	field: Field & { key: string; required?: boolean },
	obj: ApiObject & { name: string },
	fields: Field[],
	parentIsUnion: boolean,
	state: WalkState,
	out: Transform[],
) {
	if (state.visited.has(obj.name)) return;
	const access: Access = {
		key: field.key,
		inCheck: state.parentIsUnion,
		childOptional: field.required === false,
	};
	walkFields(
		fields,
		{
			path: [...state.path, access],
			parentIsUnion,
			visited: new Set([...state.visited, obj.name]),
			arrayPath: state.arrayPath,
		},
		out,
	);
}

function stepIntoOneOfVariant(
	parent: Field & { key: string; required?: boolean },
	variant: Field,
	state: WalkState,
	out: Transform[],
) {
	if (variant.type !== "reference") return;
	const vObj = objectByName.get(variant.reference.name);
	if (!vObj || vObj.type !== "fields") return;
	stepInto(parent, vObj, vObj.fields, true, state, out);
}

function findEntitiesSibling(fields: Field[], textKey: string): string | null {
	const preferred = `${textKey}_entities`;
	for (const f of fields) {
		if (f.key === preferred && f.type === "array") return f.key;
	}
	for (const f of fields) {
		if (f.key === "entities" && f.type === "array") return f.key;
	}
	return null;
}

const expr = (root: string, path: Access[]) =>
	path.reduce((e, a) => `${e}.${a.key}`, root);

function pathGuards(root: string, path: Access[]): string[] {
	const guards: string[] = [];
	let parent = root;
	for (const a of path) {
		if (a.inCheck) guards.push(`"${a.key}" in ${parent}`);
		parent = `${parent}.${a.key}`;
		if (a.childOptional) guards.push(`${parent} !== undefined`);
	}
	return guards;
}

function leafGuards(parent: string, textKey: string, inCheck: boolean): string[] {
	const g: string[] = [];
	if (inCheck) g.push(`"${textKey}" in ${parent}`);
	g.push(`isFormattableString(${parent}.${textKey})`);
	return g;
}

function renderDirect(t: Transform): string {
	const parent = expr("params", t.innerPath);
	const guards = [
		...pathGuards("params", t.innerPath),
		...leafGuards(parent, t.textKey, t.inCheckLeaf),
	];
	return `if (${guards.join(" && ")}) {
		${parent}.${t.entitiesKey} = ${parent}.${t.textKey}.entities;
		${parent}.${t.textKey} = ${parent}.${t.textKey}.text;
	}`;
}

function buildSpread(
	innerPath: Access[],
	textKey: string,
	entitiesKey: string,
): string {
	const leafParent = expr("x", innerPath);
	let inner = `{ ...${leafParent}, ${textKey}: ${leafParent}.${textKey}.text, ${entitiesKey}: ${leafParent}.${textKey}.entities }`;
	for (let i = innerPath.length - 1; i >= 0; i--) {
		const prefix = expr("x", innerPath.slice(0, i));
		inner = `{ ...${prefix}, ${innerPath[i].key}: ${inner} }`;
	}
	return inner;
}

function renderArray(t: Transform): string {
	const arrayPath = t.arrayPath!;
	const outerPath = arrayPath.slice(0, -1);
	const arrayAccess = arrayPath[arrayPath.length - 1];
	const arrayExpr = expr("params", arrayPath);

	const outerGuards = [
		...pathGuards("params", outerPath),
		...(arrayAccess.inCheck
			? [`"${arrayAccess.key}" in ${expr("params", outerPath)}`]
			: []),
	];

	const arrayCheckExpr = arrayAccess.childOptional
		? `${arrayExpr}?.length`
		: `${arrayExpr}.length`;
	const outerCond = [...outerGuards, arrayCheckExpr].join(" && ");

	const innerParent = expr("x", t.innerPath);
	const innerGuards = [
		...pathGuards("x", t.innerPath),
		...leafGuards(innerParent, t.textKey, true),
	];
	const body = buildSpread(t.innerPath, t.textKey, t.entitiesKey);

	return `if (${outerCond})
		${arrayExpr} = ${arrayExpr}.map((x) =>
			${innerGuards.join(" && ")}
				? ${body}
				: x,
		);`;
}

function dedupe(transforms: Transform[]): Transform[] {
	const byKey = new Map<string, Transform>();
	for (const t of transforms) {
		const key = JSON.stringify([
			t.arrayPath?.map((a) => a.key) ?? null,
			t.innerPath.map((a) => a.key),
			t.textKey,
			t.entitiesKey,
		]);
		const existing = byKey.get(key);
		if (existing) {
			existing.inCheckLeaf ||= t.inCheckLeaf;
			if (existing.arrayPath && t.arrayPath) {
				for (let i = 0; i < existing.arrayPath.length; i++) {
					existing.arrayPath[i].inCheck ||= t.arrayPath[i].inCheck;
					existing.arrayPath[i].childOptional ||= t.arrayPath[i].childOptional;
				}
			}
			for (let i = 0; i < existing.innerPath.length; i++) {
				existing.innerPath[i].inCheck ||= t.innerPath[i].inCheck;
				existing.innerPath[i].childOptional ||= t.innerPath[i].childOptional;
			}
		} else {
			byKey.set(key, {
				...t,
				arrayPath: t.arrayPath ? t.arrayPath.map((a) => ({ ...a })) : null,
				innerPath: t.innerPath.map((a) => ({ ...a })),
			});
		}
	}
	return [...byKey.values()];
}

const entries: string[] = [];
for (const method of schema.methods) {
	const transforms: Transform[] = [];
	walkFields(
		method.parameters,
		{ path: [], parentIsUnion: false, visited: new Set(), arrayPath: null },
		transforms,
	);
	if (!transforms.length) continue;
	const unique = dedupe(transforms);

	// Emit directs first (as-written order), then arrays
	const directs = unique.filter((t) => !t.arrayPath).map(renderDirect);
	const arrays = unique.filter((t) => t.arrayPath).map(renderArray);
	const body = [...directs, ...arrays].join("\n");
	entries.push(`${method.name}: (params) => {
		${body}
		return params;
	}`);
}

const source = `import type { APIMethodParams, APIMethods } from "@gramio/types";
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
 * @codegenerated from Telegram Bot API ${schema.version.major}.${schema.version.minor}
 */
export const FormattableMap: FormattableMethods = {
	${entries.join(",\n\t")},
};
`;

await fs.writeFile(
	OUTPUT,
	await prettier.format(source, {
		parser: "typescript",
		useTabs: true,
		tabWidth: 4,
		endOfLine: "auto",
	}),
);

console.log(
	`Generated ${OUTPUT} for ${entries.length} methods (Bot API ${schema.version.major}.${schema.version.minor}).`,
);
