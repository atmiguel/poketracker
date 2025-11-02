import * as z from "zod";

export const NonEmptyString = z.string().nonempty();

export const Integer = z.number().int();
export const PositiveInteger = Integer.positive();
