import type { BoosterPackSet } from '../types';

export interface IBoosterPackSetRetriever {
  retrieveBoosterPackSets: (params: {}) => Promise<Array<BoosterPackSet>>;
}
