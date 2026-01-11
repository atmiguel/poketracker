import type { IHtmlDownloader } from '../../core/html/interfaces/html-downloader';
import { FILE_WRITE_MODES } from '../../core/file/types';
import type { IFileReader } from '../../core/file/interfaces/file-reader';
import type { IBoosterPackRetriever } from '../interfaces/booster-pack-retriever';
import { CardUtils } from '../utils';

export class BoosterPackRetriever implements IBoosterPackRetriever {
  private readonly fileReader: IFileReader;
  private readonly htmlDownloader: IHtmlDownloader;

  public constructor(params: {
    fileReader: IFileReader;
    htmlDownloader: IHtmlDownloader;
  }) {
    this.fileReader = params.fileReader;
    this.htmlDownloader = params.htmlDownloader;
  }

  public readonly retrieveBoosterPacks: IBoosterPackRetriever['retrieveBoosterPacks'] =
    async ({ packSetId }) => {
      const path = CardUtils.getBoosterPackSetPath({ packSetId });

      await this.htmlDownloader.downloadHtmlToFile({
        mode: FILE_WRITE_MODES.DoNotOverwrite,
        path,
        url: CardUtils.getBoosterPackSetUrl({ packSetId }),
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
