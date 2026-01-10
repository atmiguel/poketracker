import assert from 'assert';
import type { Nullable } from '../../core/types';
import type { IBoosterPackSetParser } from '../interfaces/booster-pack-set-parser';
import { BoosterPackSet } from '../types';
import { PositiveIntegerString } from '../../core/zod/types';
import { parse, isValid } from 'date-fns';
import { CCard } from '../constants';
import { HtmlElement } from '../../core/html/types';

export class BoosterPackSetParser implements IBoosterPackSetParser {
  private static instance: Nullable<BoosterPackSetParser> = null;

  private constructor() {}

  public static readonly getInstance = (): BoosterPackSetParser => {
    if (BoosterPackSetParser.instance === null) {
      BoosterPackSetParser.instance = new BoosterPackSetParser();
    }

    return BoosterPackSetParser.instance;
  };

  private static readonly parseSeriesRow = ({ row }: { row: HtmlElement }): { series: string } => {
    const cells = row.getChildren();
    assert(cells.length === 1);

    const cell = cells[0]!;
    const seriesText = cell.text;
    assert(seriesText.endsWith(' Series'));

    const series = seriesText.split(' ')[0]!;
    return { series };
  };

  private static readonly parsePackSetNameCell = ({
    nameCell,
  }: {
    nameCell: HtmlElement;
  }): { id: string; name: string } => {
    const nameAnchor = nameCell.findOne('a');

    const lines = nameAnchor.text.split('\n');
    assert(lines.length === 2);

    const [name, id] = lines;
    assert(name !== undefined);
    assert(id !== undefined);

    return { id: id.trim(), name: name.trim() };
  };

  private static readonly parseReleaseDate = ({
    releaseDateText,
  }: {
    releaseDateText: string;
  }): { releaseDate: Nullable<Date> } => {
    let releaseDate: Nullable<Date>;
    if (releaseDateText.length === 0) {
      releaseDate = null;
    } else {
      releaseDate = parse(releaseDateText, 'dd MMM yy', new Date());
      if (!isValid(releaseDate)) {
        throw new Error(`expected valid release date, but got "${releaseDateText}"`);
      }

      releaseDate = new Date(
        Date.UTC(releaseDate.getUTCFullYear(), releaseDate.getUTCMonth(), releaseDate.getUTCDate()),
      );
    }

    return { releaseDate };
  };

  private static readonly parsePackSetRow = ({
    row,
  }: {
    row: HtmlElement;
  }): { cardCount: number; id: string; name: string; releaseDate: Nullable<Date> } => {
    const cells = row.getChildren();
    assert(cells.length === 3);

    const [nameCell, releaseDateCell, cardCountCell] = cells;
    assert(nameCell !== undefined);
    assert(releaseDateCell !== undefined);
    assert(cardCountCell !== undefined);

    const { id, name } = BoosterPackSetParser.parsePackSetNameCell({ nameCell });
    const cardCount = PositiveIntegerString.parse(cardCountCell.text);
    const { releaseDate } = BoosterPackSetParser.parseReleaseDate({
      releaseDateText: releaseDateCell.text,
    });

    return { cardCount, id, name, releaseDate };
  };

  public readonly parseBoosterPackSets: IBoosterPackSetParser['parseBoosterPackSets'] = ({
    data,
  }): Array<BoosterPackSet> => {
    const rootElement = HtmlElement.create({ data });
    const setsTable = rootElement.findOne('.sets-table');

    const results: Array<BoosterPackSet> = [];
    let series: Nullable<string> = null;
    for (const row of setsTable.findMany('tr')) {
      const cells = row.getChildren();

      switch (cells.length) {
        case 1: {
          const { series: result } = BoosterPackSetParser.parseSeriesRow({ row });
          series = result;
          break;
        }
        case 3: {
          const headerCells = row.findMany('th');
          if (headerCells.length > 0) {
            // skip header row
            continue;
          }

          assert(series !== null);
          const { cardCount, id, name, releaseDate } = BoosterPackSetParser.parsePackSetRow({
            row,
          });

          results.push(
            BoosterPackSet.parse({
              cardCount,
              id,
              name,
              // TODO: get packs
              packs: [
                {
                  cards: [
                    {
                      name: 'x',
                      rarity: CCard.Rarity.CROWN_1,
                    },
                  ],
                  name: 'x',
                },
              ],
              releaseDate,
              series,
            } as BoosterPackSet),
          );
          break;
        }
        default: {
          throw new Error('unexpected cell count');
        }
      }
    }

    return results;
  };
}
