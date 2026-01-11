import { CCore } from '../core/constants';
import { Path } from '../core/path/types';
import { CARD_RARITY_SYMBOLS, type CardRarity } from './types';

export namespace CCard {
  const baseUrl = 'https://pocket.limitlesstcg.com';
  export const BOOSTER_PACK_SETS_URL = `${baseUrl}/cards`;

  export const BASE_PATH = Path.create(`${CCore.RESOURCES_PATH}/card-html`);
  export const BOOSTER_PACK_SETS_PATH = Path.create(`${BASE_PATH}/booster-pack-sets.html`);

  export namespace Rarity {
    export const DIAMOND_1: CardRarity = {
      count: 1,
      symbol: CARD_RARITY_SYMBOLS.Diamond,
    };
    export const DIAMOND_2: CardRarity = {
      count: 2,
      symbol: CARD_RARITY_SYMBOLS.Diamond,
    };
    export const DIAMOND_3: CardRarity = {
      count: 3,
      symbol: CARD_RARITY_SYMBOLS.Diamond,
    };
    export const DIAMOND_4: CardRarity = {
      count: 3,
      symbol: CARD_RARITY_SYMBOLS.Diamond,
    };

    export const STAR_1: CardRarity = {
      count: 1,
      symbol: CARD_RARITY_SYMBOLS.Star,
    };
    export const STAR_2: CardRarity = {
      count: 2,
      symbol: CARD_RARITY_SYMBOLS.Star,
    };
    export const STAR_3: CardRarity = {
      count: 3,
      symbol: CARD_RARITY_SYMBOLS.Star,
    };

    export const CROWN_1: CardRarity = {
      count: 1,
      symbol: CARD_RARITY_SYMBOLS.Crown,
    };

    export const SHINY_1: CardRarity = {
      count: 1,
      symbol: CARD_RARITY_SYMBOLS.Shiny,
    };
    export const SHINY_2: CardRarity = {
      count: 2,
      symbol: CARD_RARITY_SYMBOLS.Shiny,
    };
  }
}
