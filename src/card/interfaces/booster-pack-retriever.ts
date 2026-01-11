import type { BoosterPack } from '../types';

export interface IBoosterPackRetriever {
  retrieveBoosterPacks: (params: {
    cardCount: number;
    packSetId: string;
  }) => Promise<{ boosterPacks: Array<BoosterPack> }>;
}
