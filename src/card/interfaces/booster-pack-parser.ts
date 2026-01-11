import type {  ParsedBoosterPack } from '../types';

export interface IBoosterPackParser {
  parseBoosterPack: (params: { data: string }) => {
    parsedBoosterPack: ParsedBoosterPack;
  };
}
