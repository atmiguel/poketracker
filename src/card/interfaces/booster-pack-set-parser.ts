import type { ParsedBoosterPackSet } from '../types';

export interface IBoosterPackSetParser {
  parseBoosterPackSets: (params: { data: string }) => {
    parsedBoosterPackSets: Array<ParsedBoosterPackSet>;
  };
}
