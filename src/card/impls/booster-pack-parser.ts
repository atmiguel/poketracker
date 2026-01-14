import { ParsedBoosterPack } from '../types';
import { HtmlElement } from '../../core/html/types';
import type { IBoosterPackParser } from '../interfaces/booster-pack-parser';
import assert from 'assert';
import { SortUtils } from '../../core/sort/utils';

export class BoosterPackParser implements IBoosterPackParser {
  public readonly parseBoosterPacks: IBoosterPackParser['parseBoosterPacks'] = ({ data }) => {
    const rootElement = HtmlElement.create({ data });
    const packsList = rootElement.findNullableOne('.pack-selection');

    const parsedBoosterPacks: Array<ParsedBoosterPack> = [];
    if (packsList === null) {
      parsedBoosterPacks.push({
        name: null,
      });
    } else {
      parsedBoosterPacks.push(
        ...packsList
          .findMany('button')
          .map((o) => o.text)
          .filter((name) => name !== 'All cards' && name !== 'Shared')
          .map((name) => {
            const suffix = ' pack';
            assert(name.endsWith(suffix));
            return { name: name.slice(0, -suffix.length) };
          }),
      );
    }

    const sortedBoosterPacks = SortUtils.sortByString(
      parsedBoosterPacks,
      (o) => o.name ?? '',
    );

    return { parsedBoosterPacks: sortedBoosterPacks };
  };
}
