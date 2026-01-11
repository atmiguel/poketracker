import type { BoosterPack } from '../types';

export interface IBoosterPackParser {
  parseBoosterPack: (params: { data: string }) => {
    parsedBoosterPack: BoosterPack;
  };
}
