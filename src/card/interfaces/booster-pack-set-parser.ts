import type { BoosterPackSet } from "../models/booster-pack-set";

export interface IBoosterPackSetParser {
  parseBoosterPackSets: (params: {
    data: string;
  }) => Array<BoosterPackSet>;
}
