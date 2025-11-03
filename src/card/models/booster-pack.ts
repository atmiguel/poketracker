import * as z from 'zod';
import { NonEmptyArray, NonEmptyString } from '../../core/types/zod';
import { Card } from './card';

export const BoosterPack = z.object({
  cards: NonEmptyArray(Card),
  name: z.nullable(NonEmptyString),
});
export type BoosterPack = z.infer<typeof BoosterPack>;
