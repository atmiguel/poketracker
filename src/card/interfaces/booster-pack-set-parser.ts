import type { BoosterPackSet } from '../types';

export interface IBoosterPackSetParser {
  parseBoosterPackSets: (params: { data: string }) => Array<BoosterPackSet>;
}
