import type { Nullable } from "../../core/types/builtin";
import type { IBoosterPackSetParser } from "../interfaces/booster-pack-set-parser";
import type { BoosterPackSet } from "../models/booster-pack-set";

export class BoosterPackSetParser implements IBoosterPackSetParser {
  private static instance: Nullable<BoosterPackSetParser> = null;

  private constructor() {}

  public static readonly getInstance = (): BoosterPackSetParser => {
    if (BoosterPackSetParser.instance === null) {
      BoosterPackSetParser.instance = new BoosterPackSetParser();
    }

    return BoosterPackSetParser.instance;
  };

  public readonly parseBoosterPackSets: IBoosterPackSetParser['parseBoosterPackSets'] = ({
    data,
  }): Array<BoosterPackSet> => {
    return [];
  };
}
