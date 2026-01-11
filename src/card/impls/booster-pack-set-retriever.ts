import type { Nullable } from '../../core/types';
import type { IBoosterPackSetParser } from '../interfaces/booster-pack-set-parser';
import { BoosterPackSet } from '../types';
import { CCard } from '../constants';
import type { IBoosterPackSetRetriever } from '../interfaces/booster-pack-set-retriever';
import { BoosterPackSetParser } from './booster-pack-set-parser';
import type { IHtmlDownloader } from '../../core/html/interfaces/html-downloader';
import { HtmlDownloader } from '../../core/html/impls/html-downloader';
import { FILE_WRITE_MODES } from '../../core/file/types';
import type { IFileReader } from '../../core/file/interfaces/file-reader';
import { FileManager } from '../../core/file/impls/file-manager';

export class BoosterPackSetRetriever implements IBoosterPackSetRetriever {
  private static instance: Nullable<BoosterPackSetRetriever> = null;

  private readonly boosterPackSetParser: IBoosterPackSetParser;
  private readonly fileReader: IFileReader;
  private readonly htmlDownloader: IHtmlDownloader;

  private constructor(params: {
    boosterPackSetParser: IBoosterPackSetParser;
    fileReader: IFileReader;
    htmlDownloader: IHtmlDownloader;
  }) {
    this.boosterPackSetParser = params.boosterPackSetParser;
    this.fileReader = params.fileReader;
    this.htmlDownloader = params.htmlDownloader;
  }

  public static readonly getInstance = (): BoosterPackSetRetriever => {
    if (BoosterPackSetRetriever.instance === null) {
      BoosterPackSetRetriever.instance = new BoosterPackSetRetriever({
        boosterPackSetParser: BoosterPackSetParser.getInstance(),
        fileReader: FileManager.getInstance(),
        htmlDownloader: HtmlDownloader.getInstance(),
      });
    }

    return BoosterPackSetRetriever.instance;
  };

  public readonly retrieveBoosterPackSets: IBoosterPackSetRetriever['retrieveBoosterPackSets'] =
    async ({}) => {
      await this.htmlDownloader.downloadHtmlToFile({
        mode: FILE_WRITE_MODES.DoNotOverwrite,
        path: CCard.BOOSTER_PACK_SETS_PATH,
        url: CCard.BOOSTER_PACK_SETS_URL,
      });
      const { contents } = await this.fileReader.readFromFile({
        path: CCard.BOOSTER_PACK_SETS_PATH,
      });
      const { parsedBoosterPackSets } = this.boosterPackSetParser.parseBoosterPackSets({
        data: contents,
      });

      // TODO parse packs

      const boosterPackSets: Array<BoosterPackSet> = parsedBoosterPackSets.map(
        (parsedBoosterPackSet): BoosterPackSet => {
          return {
            ...parsedBoosterPackSet,
            packs: [],
          };
        },
      );

      return { boosterPackSets };
    };
}
