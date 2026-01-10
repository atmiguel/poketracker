import { CCore } from '../core/constants';
import { Path } from '../core/path/types';
import { CARD_RARITY_SYMBOLS, type CardRarity } from './types';

export namespace CCard {
  const baseUrl = 'https://pocket.limitlesstcg.com';
  export const BOOSTER_PACK_SETS_URL = `${baseUrl}/cards`;

  const basePath = Path.create(`${CCore.RESOURCES_PATH}/card-html`);
  export const BOOSTER_PACK_SETS_PATH = Path.create(`${basePath}/booster-pack-sets.html`);

  export namespace Rarity {
    export const DIAMOND_1: CardRarity = {
      count: 1,
      symbol: CARD_RARITY_SYMBOLS.diamond,
    };
    export const DIAMOND_2: CardRarity = {
      count: 2,
      symbol: CARD_RARITY_SYMBOLS.diamond,
    };
    export const DIAMOND_3: CardRarity = {
      count: 3,
      symbol: CARD_RARITY_SYMBOLS.diamond,
    };
    export const DIAMOND_4: CardRarity = {
      count: 3,
      symbol: CARD_RARITY_SYMBOLS.diamond,
    };

    export const STAR_1: CardRarity = {
      count: 1,
      symbol: CARD_RARITY_SYMBOLS.star,
    };
    export const STAR_2: CardRarity = {
      count: 2,
      symbol: CARD_RARITY_SYMBOLS.star,
    };
    export const STAR_3: CardRarity = {
      count: 3,
      symbol: CARD_RARITY_SYMBOLS.star,
    };

    export const CROWN_1: CardRarity = {
      count: 1,
      symbol: CARD_RARITY_SYMBOLS.crown,
    };

    export const SHINY_1: CardRarity = {
      count: 1,
      symbol: CARD_RARITY_SYMBOLS.shiny,
    };
    export const SHINY_2: CardRarity = {
      count: 2,
      symbol: CARD_RARITY_SYMBOLS.shiny,
    };
  }
}
