import assert from 'assert';
import type { Nullable } from '../../core/types/builtin';
import type { IBoosterPackSetParser } from '../interfaces/booster-pack-set-parser';
import type { BoosterPackSet } from '../models/booster-pack-set';
import { load } from 'cheerio';

const isTagElement = (element: cheerio.Element): element is cheerio.TagElement => {
  return element.type === "tag";
}

const isTextElement = (element: cheerio.Element): element is cheerio.TextElement => {
  return element.type === "text";
}

const getTagChildren = (element: cheerio.TagElement ): Array<cheerio.TagElement> => {
  return element.children.filter(isTagElement);
};

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
    const $ = load(data);

    const setsTable = $('.sets-table');
    assert(setsTable.length === 1);

    const results: Array<BoosterPackSet> = [];
    const rows = setsTable.find('tr');
    for (const row of rows.toArray().map($)) {
      const cells = row.children();

      switch (cells.length) {
        case 1: {
          // series row
          const cell = cells[0];
          console.log($(cell).text());
          break;
        }
        case 3: {
          // either header row or pack set row

          const [nameCell, releaseDateCell, cardCountCell] = cells.toArray().map($);
          assert(nameCell !== undefined);
          assert(releaseDateCell !== undefined);
          assert(cardCountCell !== undefined);

          if (nameCell.is('th')) {
            // header row
            continue;
          }

          const nameLink = nameCell.find('a');
          assert(nameLink.length === 1);
          const nameLinkElement = nameLink[0]!;
          assert(isTagElement(nameLinkElement));

          assert(nameLinkElement.children.length === 5);
          const [_, __, nameElement, setIdElement, ___] = nameLinkElement.children;
          assert(nameElement !== undefined);
          assert(setIdElement !== undefined);

          const name = $(nameElement).text().trim();
          const setId = $(setIdElement).text().trim();

          // TODO: clean this up
          results.push({
            id: setId,
            name,
            packs: [],
            releaseDate: null,
            series: '',
          });

          break;
        }
        default: {
          throw new Error("unexpected cell count");
        }
      }
    }

    return results;
  };
}
