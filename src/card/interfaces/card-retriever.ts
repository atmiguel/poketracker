import type { BoosterPack } from '../types';

export interface ICardRetriever {
  retrieveCards: (params: { packSetId: string }) => Promise<{ boosterPacks: Array<BoosterPack> }>;
}
