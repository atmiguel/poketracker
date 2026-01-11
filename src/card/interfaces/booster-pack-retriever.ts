import type { BoosterPack } from '../types';

export interface IBoosterPackRetriever {
  retrieveBoosterPacks: (params: {
    packSetId: string;
  }) => Promise<{ boosterPacks: Array<BoosterPack> }>;
}
