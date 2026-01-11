import type { Nullable } from '../../core/types';
import type { Card } from '../types';

export interface ICardRetriever {
  retrieveCards: (params: {
    packName: Nullable<string>;
    packSetId: string;
  }) => Promise<{ cards: Array<Card> }>;
}
