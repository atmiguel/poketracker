import type { ParsedCard } from '../types';

export interface ICardParser {
  parseCard: (params: { data: string }) => {
    parsedCard: ParsedCard;
  };
}
