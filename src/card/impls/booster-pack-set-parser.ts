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

class HtmlElement {
  private readonly element: cheerio.Element;
  private readonly root: cheerio.Root;

  private constructor(params: { element: cheerio.Element; root: cheerio.Root }) {
    this.element = params.element;
    this.root = params.root;
  }

  public static readonly create = ({data}: { data: string }): HtmlElement => {
    const root = load(data);

    const htmlCheerio = root('html');
    assert(htmlCheerio.length === 1);
    const element = htmlCheerio[0]!;

    return new HtmlElement({ element, root });
  };

  private get cheerio(): cheerio.Cheerio {
    return this.root(this.element);
  }

  public get length(): number {
    return this.cheerio.length;
  }

  public get text(): string {
    return this.cheerio.text().trim();
  }

  private readonly createFromElement = (element: cheerio.Element): HtmlElement => {
    return new HtmlElement({ element, root: this.root });
  };

  private readonly getElementArray = (cheerio: cheerio.Cheerio) => {
    return cheerio.toArray().map(this.createFromElement);
  };

  public readonly getChildren = (): Array<HtmlElement> => {
    return this.getElementArray(this.cheerio.children());
  };

  public readonly findOne = (selector: string): HtmlElement => {
    const results = this.cheerio.find(selector);
    assert(results.length === 1);
    return this.createFromElement(results[0]!);
  }

  public readonly findMany = (selector: string): Array<HtmlElement> => {
    const results = this.cheerio.find(selector);
    return this.getElementArray(results);
  }
}

export class BoosterPackSetParser implements IBoosterPackSetParser {
  private static instance: Nullable<BoosterPackSetParser> = null;

  private constructor() {}

  public static readonly getInstance = (): BoosterPackSetParser => {
    if (BoosterPackSetParser.instance === null) {
      BoosterPackSetParser.instance = new BoosterPackSetParser();
    }

    return BoosterPackSetParser.instance;
  };

  private static readonly parseSeriesRow = ({row}:{row: HtmlElement}): { series: string } => {
    const cells = row.getChildren();

    assert(cells.length === 1);
    const cell = cells[0]!;

    const seriesText = cell.text;
    assert(seriesText.endsWith(' Series'));

    const series = seriesText.split(' ')[0]!;
    return { series };
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
          // either header row or pack set row
          break;
        }
        default: {
          throw new Error("unexpected cell count");
        }
      }

      console.log(series);
    }
    // for (const row of reader.getChildren(setsTable)) {
    //   const cells = row.children();

    //   switch (cells.length) {
    //     case 1: {
    //       // series row
    //       const cell = cells[0];
    //       console.log($(cell).text());
    //       break;
    //     }
    //     case 3: {
    //       // either header row or pack set row

    //       const [nameCell, releaseDateCell, cardCountCell] = cells.toArray().map($);
    //       assert(nameCell !== undefined);
    //       assert(releaseDateCell !== undefined);
    //       assert(cardCountCell !== undefined);

    //       if (nameCell.is('th')) {
    //         // header row
    //         continue;
    //       }

    //       const nameLink = nameCell.find('a');
    //       assert(nameLink.length === 1);
    //       const nameLinkElement = nameLink[0]!;
    //       assert(isTagElement(nameLinkElement));

    //       assert(nameLinkElement.children.length === 5);
    //       const [_, __, nameElement, setIdElement, ___] = nameLinkElement.children;
    //       assert(nameElement !== undefined);
    //       assert(setIdElement !== undefined);

    //       const name = $(nameElement).text().trim();
    //       const setId = $(setIdElement).text().trim();

    //       // TODO: clean this up
    //       results.push({
    //         id: setId,
    //         name,
    //         packs: [],
    //         releaseDate: null,
    //         series: '',
    //       });

    //       break;
    //     }
    //     default: {
    //       throw new Error("unexpected cell count");
    //     }
    //   }
    // }

    return results;
  };
}
