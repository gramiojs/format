import { expectTypeOf } from "expect-type";
import {
	type FormattableString,
	expandableBlockquote,
	format,
	link,
} from "../../src/index.ts";

const a = format`${expandableBlockquote`${1}`}`;

// const b = format`${link``}`

expectTypeOf(a).toEqualTypeOf<FormattableString>();
