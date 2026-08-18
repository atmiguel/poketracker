import { BoosterPackSet } from '../types';
import type { IBoosterPackSetRetriever } from '../interfaces/booster-pack-set-retriever';
import flibustierSets from 'pokemon-tcg-pocket-database/dist/sets.json';


export class FlibustierBoosterPackSetRetriever implements IBoosterPackSetRetriever {
  public readonly retrieveBoosterPackSets: IBoosterPackSetRetriever['retrieveBoosterPackSets'] =
    async ({}) => {
      const boosterPackSets: Array<BoosterPackSet> = [];

      for (const [series, packSets] of Object.entries(flibustierSets)) {
        for (const packSet of packSets) {
          if (packSet.code.startsWith('PROMO-')) {
            continue;
          }

          if (packSet.count === undefined) {
            throw new Error(`Pack set ${packSet.code} has no count`);
          }

          boosterPackSets.push({
            cardCount: packSet.count,
            id: packSet.code,
            name: packSet.name.en,
            // TODO: Add packs
            packs: [],
            releaseDate: new Date(packSet.releaseDate),
            series,
          });
        }
      }

      return { boosterPackSets };
    };
}
