import * as z from 'zod';
import { NonEmptyArray, NonEmptyString, PositiveInteger } from './zod_types';
import { getRequiredValue } from './objects';

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
    const maxCount = getRequiredValue(MAX_COUNTS_BY_SYMBOL, symbol);
    return count <= maxCount;
  });
export type CardRarity = z.infer<typeof CardRarity>;

export namespace CardRarityConstants {
  export const DIAMOND_1: CardRarity = {
    count: 1,
    symbol: CARD_RARITY_SYMBOLS.diamond,
  };
  export const DIAMOND_2: CardRarity = {
    count: 2,
    symbol: CARD_RARITY_SYMBOLS.diamond,
  };
  export const DIAMOND_3: CardRarity = {
    count: 3,
    symbol: CARD_RARITY_SYMBOLS.diamond,
  };
  export const DIAMOND_4: CardRarity = {
    count: 3,
    symbol: CARD_RARITY_SYMBOLS.diamond,
  };

  export const STAR_1: CardRarity = {
    count: 1,
    symbol: CARD_RARITY_SYMBOLS.star,
  };
  export const STAR_2: CardRarity = {
    count: 2,
    symbol: CARD_RARITY_SYMBOLS.star,
  };
  export const STAR_3: CardRarity = {
    count: 3,
    symbol: CARD_RARITY_SYMBOLS.star,
  };

  export const CROWN_1: CardRarity = {
    count: 1,
    symbol: CARD_RARITY_SYMBOLS.crown,
  };

  export const SHINY_1: CardRarity = {
    count: 1,
    symbol: CARD_RARITY_SYMBOLS.shiny,
  };
  export const SHINY_2: CardRarity = {
    count: 2,
    symbol: CARD_RARITY_SYMBOLS.shiny,
  };
}

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
  id: NonEmptyString,
  name: NonEmptyString,
  packs: NonEmptyArray(BoosterPack),
  releaseDate: z.nullable(z.date()),
  series: NonEmptyString,
});
export type BoosterPackSet = z.infer<typeof BoosterPackSet>;
