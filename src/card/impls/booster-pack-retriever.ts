import type { IHtmlAccessor } from '../../core/html/interfaces/html-downloader';
import { FILE_WRITE_MODES } from '../../core/html/types';
import type { IFileReader } from '../../core/file/interfaces/file-reader';
import type { IBoosterPackRetriever } from '../interfaces/booster-pack-retriever';
import { CardUtils } from '../utils';
import type { IBoosterPackParser } from '../interfaces/booster-pack-parser';
import type { BoosterPack } from '../types';
import type { ICardRetriever } from '../interfaces/card-retriever';

export class BoosterPackRetriever implements IBoosterPackRetriever {
  private readonly boosterPackParser: IBoosterPackParser;
  private readonly cardRetriever: ICardRetriever;
  private readonly fileReader: IFileReader;
  private readonly htmlDownloader: IHtmlAccessor;

  public constructor(params: {
    boosterPackParser: IBoosterPackParser;
    cardRetriever: ICardRetriever;
    fileReader: IFileReader;
    htmlDownloader: IHtmlAccessor;
  }) {
    this.boosterPackParser = params.boosterPackParser;
    this.cardRetriever = params.cardRetriever;
    this.fileReader = params.fileReader;
    this.htmlDownloader = params.htmlDownloader;
  }

  public readonly retrieveBoosterPacks: IBoosterPackRetriever['retrieveBoosterPacks'] = async ({
    cardCount,
    packSetId,
  }) => {
    const path = CardUtils.getBoosterPackSetPath({ packSetId });

    // TODO: Merge html downloaer and file reader
    await this.htmlDownloader.downloadHtmlToFile({
      mode: FILE_WRITE_MODES.DoNotOverwrite,
      path,
      url: CardUtils.getBoosterPackSetUrl({ packSetId }),
    });
    const { contents } = await this.fileReader.readFromFile({
      path,
    });
    const { parsedBoosterPacks } = this.boosterPackParser.parseBoosterPacks({
      data: contents,
    });

    const boosterPacks: Array<BoosterPack> = [];
    for (const parsedBoosterPack of parsedBoosterPacks) {
      const { cards } = await this.cardRetriever.retrieveCards({
        cardCount,
        packSetId,
        packName: parsedBoosterPack.name,
      });

      boosterPacks.push({
        ...parsedBoosterPack,
        cards,
      });
    }

    return { boosterPacks };
  };
}
