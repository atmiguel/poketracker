import type { IHtmlDownloader } from '../../core/html/interfaces/html-downloader';
import { FILE_WRITE_MODES } from '../../core/file/types';
import type { IFileReader } from '../../core/file/interfaces/file-reader';
import type { IBoosterPackRetriever } from '../interfaces/booster-pack-retriever';
import { CardUtils } from '../utils';
import type { IBoosterPackParser } from '../interfaces/booster-pack-parser';

export class BoosterPackRetriever implements IBoosterPackRetriever {
  private readonly boosterPackParser: IBoosterPackParser;
  private readonly fileReader: IFileReader;
  private readonly htmlDownloader: IHtmlDownloader;

  public constructor(params: {
    boosterPackParser: IBoosterPackParser;
    fileReader: IFileReader;
    htmlDownloader: IHtmlDownloader;
  }) {
    this.boosterPackParser = params.boosterPackParser;
    this.fileReader = params.fileReader;
    this.htmlDownloader = params.htmlDownloader;
  }

  public readonly retrieveBoosterPacks: IBoosterPackRetriever['retrieveBoosterPacks'] = async ({
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

    console.log(parsedBoosterPacks);

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
