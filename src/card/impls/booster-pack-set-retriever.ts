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
import type { IBoosterPackRetriever } from '../interfaces/booster-pack-retriever';

export class BoosterPackSetRetriever implements IBoosterPackSetRetriever {
  private static instance: Nullable<BoosterPackSetRetriever> = null;

  private readonly boosterPackSetParser: IBoosterPackSetParser;
  private readonly boosterPackRetriever: IBoosterPackRetriever;
  private readonly fileReader: IFileReader;
  private readonly htmlDownloader: IHtmlDownloader;

  private constructor(params: {
    boosterPackSetParser: IBoosterPackSetParser;
    boosterPackRetriever: IBoosterPackRetriever;
    fileReader: IFileReader;
    htmlDownloader: IHtmlDownloader;
  }) {
    this.boosterPackSetParser = params.boosterPackSetParser;
    this.boosterPackRetriever = params.boosterPackRetriever;
    this.fileReader = params.fileReader;
    this.htmlDownloader = params.htmlDownloader;
  }

  public static readonly getInstance = (): BoosterPackSetRetriever => {
    if (BoosterPackSetRetriever.instance === null) {
      BoosterPackSetRetriever.instance = new BoosterPackSetRetriever({
        boosterPackSetParser: BoosterPackSetParser.getInstance(),
        boosterPackRetriever: BoosterPackRetriever.getInstance(),
        fileReader: FileManager.getInstance(),
        htmlDownloader: HtmlDownloader.getInstance(),
      });
    }

    return BoosterPackSetRetriever.instance;
  };

  public readonly retrieveBoosterPackSets: IBoosterPackSetRetriever['retrieveBoosterPackSets'] =
    async ({}) => {
      const path = CCard.BOOSTER_PACK_SETS_PATH;

      await this.htmlDownloader.downloadHtmlToFile({
        mode: FILE_WRITE_MODES.DoNotOverwrite,
        path,
        url: CCard.BOOSTER_PACK_SETS_URL,
      });
      const { contents } = await this.fileReader.readFromFile({
        path,
      });
      const { parsedBoosterPackSets } = this.boosterPackSetParser.parseBoosterPackSets({
        data: contents,
      });

      const boosterPackSets: Array<BoosterPackSet> = await Promise.all(parsedBoosterPackSets.map(
        async (parsedBoosterPackSet): Promise<BoosterPackSet> => {
          const { boosterPacks } = await this.boosterPackRetriever.retrieveBoosterPacks({ packSetId: parsedBoosterPackSet.id });

          return {
            ...parsedBoosterPackSet,
            packs: boosterPacks,
          };
        },
      ));

      return { boosterPackSets };
    };
}
