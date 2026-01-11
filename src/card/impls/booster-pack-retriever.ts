import type { IHtmlDownloader } from '../../core/html/interfaces/html-downloader';
import { FILE_WRITE_MODES } from '../../core/file/types';
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
  private readonly htmlDownloader: IHtmlDownloader;

  public constructor(params: {
    boosterPackParser: IBoosterPackParser;
    cardRetriever: ICardRetriever;
    fileReader: IFileReader;
    htmlDownloader: IHtmlDownloader;
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

    const boosterPacks: Array<BoosterPack> = await Promise.all(
      parsedBoosterPacks.map(async (parsedBoosterPack): Promise<BoosterPack> => {
        const { cards } = await this.cardRetriever.retrieveCards({
          cardCount,
          packSetId,
          packName: parsedBoosterPack.name,
        });

        return {
          ...parsedBoosterPack,
          cards,
        };
      }),
    );

    return { boosterPacks };
  };
}
