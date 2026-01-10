import * as z from 'zod';
import { NonEmptyArray, NonEmptyString, PositiveInteger } from '../core/zod/types';
import { UObject } from '../core/object/utils';

export const CardRaritySymbol = z.enum(['crown', 'diamond', 'shiny', 'star']);
export type CardRaritySymbol = z.infer<typeof CardRaritySymbol>;
export const CARD_RARITY_SYMBOLS = CardRaritySymbol.enum;

const MAX_COUNTS_BY_SYMBOL: Record<CardRaritySymbol, number> = {
  crown: 1,
  diamond: 4,
  shiny: 2,
  star: 3,
};
export const CardRarity = z
  .object({
    count: PositiveInteger,
    symbol: CardRaritySymbol,
  })
  .refine(({ count, symbol }) => {
    const maxCount = UObject.getRequiredValue(MAX_COUNTS_BY_SYMBOL, symbol);
    return count <= maxCount;
  });
export type CardRarity = z.infer<typeof CardRarity>;

export const Card = z.object({
  name: NonEmptyString,
  rarity: CardRarity,
});
export type Card = z.infer<typeof Card>;

export const BoosterPack = z.object({
  cards: NonEmptyArray(Card),
  name: z.nullable(NonEmptyString),
});
export type BoosterPack = z.infer<typeof BoosterPack>;

export const BoosterPackSet = z.object({
  cardCount: PositiveInteger,
  id: NonEmptyString,
  name: NonEmptyString,
  packs: NonEmptyArray(BoosterPack),
  releaseDate: z.nullable(z.date()),
  series: NonEmptyString,
});
export type BoosterPackSet = z.infer<typeof BoosterPackSet>;
