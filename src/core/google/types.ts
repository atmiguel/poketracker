import z from 'zod';
import { NonEmptyString, NonNegativeInteger } from '../zod/types';

export const Sheet = z.object({
  id: NonNegativeInteger,
  name: NonEmptyString,
});
export type Sheet = z.infer<typeof Sheet>;
