import * as z from 'zod';
import {
  NonEmptyArray,
  NonEmptyString,
  NonNegativeInteger,
  PositiveInteger,
} from '../core/zod/types';
import { ObjectUtils } from '../core/object/utils';

export const CardRaritySymbol = z.enum(['Crown', 'Diamond', 'Shiny', 'Star']);
export type CardRaritySymbol = z.infer<typeof CardRaritySymbol>;
export const CARD_RARITY_SYMBOLS = CardRaritySymbol.enum;

const MAX_COUNTS_BY_SYMBOL: Record<CardRaritySymbol, number> = {
  Crown: 1,
  Diamond: 4,
  Shiny: 2,
  Star: 3,
};
export const CardRarity = z
  .strictObject({
    count: PositiveInteger,
    symbol: CardRaritySymbol,
  })
  .refine(({ count, symbol }) => {
    const maxCount = ObjectUtils.getRequiredValue(MAX_COUNTS_BY_SYMBOL, symbol);
    return count <= maxCount;
  });
export type CardRarity = z.infer<typeof CardRarity>;

export const Card = z.strictObject({
  name: NonEmptyString,
  number: NonNegativeInteger,
  rarity: CardRarity,
});
export type Card = z.infer<typeof Card>;

export const ParsedCard = Card.omit({
  number: true,
}).safeExtend({
  packName: z.nullable(NonEmptyString),
});
export type ParsedCard = z.infer<typeof ParsedCard>;

export const BoosterPack = z.strictObject({
  cards: NonEmptyArray(Card),
  name: z.nullable(NonEmptyString),
});
export type BoosterPack = z.infer<typeof BoosterPack>;

export const ParsedBoosterPack = BoosterPack.omit({
  cards: true,
});
export type ParsedBoosterPack = z.infer<typeof ParsedBoosterPack>;

export const BoosterPackSet = z.strictObject({
  cardCount: PositiveInteger,
  id: NonEmptyString,
  name: NonEmptyString,
  packs: NonEmptyArray(BoosterPack),
  releaseDate: z.nullable(z.date()),
  series: NonEmptyString,
});
export type BoosterPackSet = z.infer<typeof BoosterPackSet>;

export const ParsedBoosterPackSet = BoosterPackSet.omit({
  packs: true,
});
export type ParsedBoosterPackSet = z.infer<typeof ParsedBoosterPackSet>;
