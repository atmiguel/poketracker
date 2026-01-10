import { CCore } from '../core/constants';
import { Path as TPath } from '../core/path/types';
import { CARD_RARITY_SYMBOLS, type CardRarity } from './models/card-rarity';

export namespace CCard {
  export namespace Url {
    const base = 'https://pocket.limitlesstcg.com';

    export const BOOSTER_PACK_SETS = `${base}/cards`;
  }

  export namespace Path {
    const base = TPath.create(`${CCore.Path.RESOURCES}/card-html`);

    export const BOOSTER_PACK_SETS = TPath.create(`${base}/booster-pack-sets.html`);
  }

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
