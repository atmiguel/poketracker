import assert from 'assert';
import { load } from 'cheerio';

export class HtmlElement {
  private readonly element: cheerio.Element;
  private readonly root: cheerio.Root;

  private constructor(params: { element: cheerio.Element; root: cheerio.Root }) {
    this.element = params.element;
    this.root = params.root;
  }

  public static readonly create = ({ data }: { data: string }): HtmlElement => {
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
  };

  public readonly findMany = (selector: string): Array<HtmlElement> => {
    const results = this.cheerio.find(selector);
    return this.getElementArray(results);
  };
}
