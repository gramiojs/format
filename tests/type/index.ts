import { expectTypeOf } from "expect-type";
import {
	type FormattableString,
	expandableBlockquote,
	format,
} from "../../src/index.ts";

const a = format`${expandableBlockquote`${format`${1}`}`}`;

expectTypeOf(a).toEqualTypeOf<FormattableString>();
