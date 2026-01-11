import type { ParsedBoosterPack } from '../types';

export interface IBoosterPackParser {
  parseBoosterPacks: (params: { data: string }) => {
    parsedBoosterPacks: Array<ParsedBoosterPack>;
  };
}
