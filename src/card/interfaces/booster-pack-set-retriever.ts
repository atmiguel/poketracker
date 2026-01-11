import type { BoosterPackSet } from '../types';

export interface IBoosterPackSetRetriever {
  retrieveBoosterPackSets: (params: {}) => Promise<{ boosterPackSets: Array<BoosterPackSet> }>;
}
