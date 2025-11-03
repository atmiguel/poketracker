import * as z from 'zod';
import { NonEmptyString } from '../../core/types/zod';
import { CardRarity } from './card-rarity';

export const Card = z.object({
  name: NonEmptyString,
  rarity: CardRarity,
});
export type Card = z.infer<typeof Card>;
