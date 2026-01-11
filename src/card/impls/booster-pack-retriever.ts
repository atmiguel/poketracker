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
import { UCard } from '../utils';

export class BoosterPackRetriever implements IBoosterPackRetriever {
  private static instance: Nullable<BoosterPackRetriever> = null;

  private readonly fileReader: IFileReader;
  private readonly htmlDownloader: IHtmlDownloader;

  private constructor(params: {
    fileReader: IFileReader;
    htmlDownloader: IHtmlDownloader;
  }) {
    this.fileReader = params.fileReader;
    this.htmlDownloader = params.htmlDownloader;
  }

  public static readonly getInstance = (): BoosterPackRetriever => {
    if (BoosterPackRetriever.instance === null) {
      BoosterPackRetriever.instance = new BoosterPackRetriever({
        fileReader: FileManager.getInstance(),
        htmlDownloader: HtmlDownloader.getInstance(),
      });
    }

    return BoosterPackRetriever.instance;
  };

  public readonly retrieveBoosterPacks: IBoosterPackRetriever['retrieveBoosterPacks'] =
    async ({ packSetId }) => {
      const path = UCard.getBoosterPackSetPath({ packSetId });

      await this.htmlDownloader.downloadHtmlToFile({
        mode: FILE_WRITE_MODES.DoNotOverwrite,
        path,
        url: UCard.getBoosterPackSetUrl({ packSetId }),
      });
      const { contents } = await this.fileReader.readFromFile({
        path,
      });
      // const { parsedBoosterPackSets } = this.boosterPackSetParser.parseBoosterPackSets({
      //   data: contents,
      // });

      // const boosterPackSets: Array<BoosterPackSet> = await Promise.all(parsedBoosterPackSets.map(
      //   async (parsedBoosterPackSet): Promise<BoosterPackSet> => {
      //     const { boosterPacks } = await this.boosterPackRetriever.retrieveBoosterPacks({ packSetId: parsedBoosterPackSet.id });

      //     return {
      //       ...parsedBoosterPackSet,
      //       packs: boosterPacks,
      //     };
      //   },
      // ));

      return { boosterPacks: [] };
    };
}
