import * as z from 'zod';

export const NonEmptyString = z.string().trim().nonempty();

export const Integer = z.number().int();
export const PositiveInteger = Integer.positive();

export const IntegerString = NonEmptyString.transform((s) => Number.parseInt(s));
export const PositiveIntegerString = IntegerString.pipe(PositiveInteger);

export const NonEmptyArray = <T extends z.ZodObject>(element: T): z.ZodArray<T> => {
  return z.array(element).nonempty();
};
