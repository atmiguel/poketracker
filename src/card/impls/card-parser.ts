import { HtmlElement } from '../../core/html/types';
import type { ICardParser } from '../interfaces/card-parser';
import { CardConstants } from '../constants';

export class CardParser implements ICardParser {
  public constructor() {}

  public readonly parseCard: ICardParser['parseCard'] = ({ data }) => {
    const rootElement = HtmlElement.create({ data });
    // const packsList = rootElement.findNullableOne('.pack-selection');

    // const parsedBoosterPacks: Array<ParsedBoosterPack> = [];
    // if (packsList === null) {
    //   parsedBoosterPacks.push({
    //     name: null,
    //   });
    // } else {
    //   parsedBoosterPacks.push(
    //     ...packsList
    //       .findMany('button')
    //       .map((o) => o.text)
    //       .filter((name) => name !== 'All cards' && name !== 'Shared')
    //       .map((name) => ({ name })),
    //   );
    // }

    // return { parsedBoosterPacks };
    return {
      parsedCard: {
      name: 'whatever',
      number: 3,
      rarity: CardConstants.Rarity.DIAMOND_1,
      packName: null,
      }
    };
  };
}
