import * as z from 'zod';
import { PositiveInteger } from '../../core/types/zod';
import { getRequiredValue } from '../../core/object/utils';

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
