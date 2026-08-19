import { BoosterPack, BoosterPackSet, Card, CardRarity, CardRaritySymbol } from '../types';
import type { IBoosterPackSetRetriever } from '../interfaces/booster-pack-set-retriever';
import flibustierSets from 'pokemon-tcg-pocket-database/dist/sets.json';
import flibustierCards from 'pokemon-tcg-pocket-database/dist/cards.no-image.min.json';
import flibustierRarities from 'pokemon-tcg-pocket-database/dist/rarities.json';
import { ObjectUtils } from '../../core/object/utils';


export class FlibustierBoosterPackSetRetriever implements IBoosterPackSetRetriever {
  private static readonly getCardRarity = (rarity: string): CardRarity => {
    const flibustierRarity = ObjectUtils.getRequiredValue(flibustierRarities, rarity);

    return {
      count: flibustierRarity.count,
      symbol: CardRaritySymbol.parse(flibustierRarity.group),
    };
  };

  private static readonly getCard = (card: typeof flibustierCards[number]): Card => {
    return {
      name: card.name,
      number: card.number,
      rarity: FlibustierBoosterPackSetRetriever.getCardRarity(card.rarity),
    };
  };

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

          const setCards = flibustierCards.filter((card) => card.set === packSet.code);

          const packs: Array<BoosterPack> = packSet.packs.map((packName) => ({
            cards: setCards.filter((card) => card.packs === undefined || card.packs.includes(packName)).map(FlibustierBoosterPackSetRetriever.getCard),
            name: packName,
          }));

          boosterPackSets.push({
            cardCount: setCards.length,
            id: packSet.code,
            name: packSet.name.en,
            packs,
            releaseDate: new Date(packSet.releaseDate),
            series,
          });
        }
      }

      return { boosterPackSets };
    };
}
