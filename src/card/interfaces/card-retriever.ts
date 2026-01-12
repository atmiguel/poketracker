import type { Nullable } from '../../core/types';
import type { Card, ParsedCard } from '../types';

export interface ICardRetriever {
  retrieveCard: (params: {
    canBeShiny: boolean;
    cardNumber: number;
    packSetId: string;
  }) => Promise<{ parsedCard: ParsedCard }>;

  retrieveCards: (params: {
    cardCount: number;
    packName: Nullable<string>;
    packSetId: string;
  }) => Promise<{ cards: Array<Card> }>;
}
