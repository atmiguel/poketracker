import * as z from 'zod';
import { NonEmptyArray, NonEmptyString, PositiveInteger } from '../../core/types/zod';
import { BoosterPack } from './booster-pack';

export const BoosterPackSet = z.object({
  cardCount: PositiveInteger,
  id: NonEmptyString,
  name: NonEmptyString,
  packs: NonEmptyArray(BoosterPack),
  releaseDate: z.nullable(z.date()),
  series: NonEmptyString,
});
export type BoosterPackSet = z.infer<typeof BoosterPackSet>;
