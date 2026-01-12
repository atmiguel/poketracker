import { HtmlElement } from '../../core/html/types';
import type { ICardParser } from '../interfaces/card-parser';
import type { Nullable } from '../../core/types';
import { CARD_RARITY_SYMBOLS, ParsedCard, type CardRarity } from '../types';

export class CardParser implements ICardParser {
  public readonly parseCard: ICardParser['parseCard'] = ({ canBeShiny, data }) => {
    const rootElement = HtmlElement.create({ data });

    const name = rootElement.findOne('.card-text-name').text.trim();

    const details = rootElement.findOne('.prints-current-details');
    const detailsList = details.text.split('·').map((o) => o.trim());

    let packName: Nullable<string>;
    switch (detailsList.length) {
      case 2: {
        packName = null;
        break;
      }
      case 3: {
        packName = detailsList[2]!.replace('  ', ' ');
        break;
      }
      default: {
        throw new Error('unexpected details list length');
      }
    }

    const rarityString = detailsList[1]!;
    let rarity: CardRarity;
    if (rarityString.includes('◊')) {
      rarity = {
        count: rarityString.length,
        symbol: CARD_RARITY_SYMBOLS.Diamond,
      };
    } else if (rarityString.includes('☆')) {
      rarity = {
        count: rarityString.length,
        symbol: canBeShiny && rarityString.length <= 2 ? CARD_RARITY_SYMBOLS.Shiny : CARD_RARITY_SYMBOLS.Star,
      };
    } else if (rarityString.includes('Crown Rare')) {
      rarity = {
        count: 1,
        symbol: CARD_RARITY_SYMBOLS.Crown,
      };
    } else {
      throw new Error(`unexpected rarity string: ${rarityString}`);
    }

    const parsedCard: ParsedCard = {
      name,
      rarity,
      packName,
    };
    return { parsedCard };
  };
}
