import type { IBoosterPackSetParser } from '../interfaces/booster-pack-set-parser';
import { BoosterPackSet } from '../types';
import { CardConstants } from '../constants';
import type { IBoosterPackSetRetriever } from '../interfaces/booster-pack-set-retriever';
import type { IHtmlAccessor } from '../../core/html/interfaces/html-downloader';
import type { IFileReader } from '../../core/file/interfaces/file-reader';
import type { IBoosterPackRetriever } from '../interfaces/booster-pack-retriever';
import { SortUtils } from '../../core/sort/utils';
import { FILE_WRITE_MODES } from '../../core/html/types';

export class BoosterPackSetRetriever implements IBoosterPackSetRetriever {
  private readonly boosterPackSetParser: IBoosterPackSetParser;
  private readonly boosterPackRetriever: IBoosterPackRetriever;
  private readonly fileReader: IFileReader;
  private readonly htmlDownloader: IHtmlAccessor;

  public constructor(params: {
    boosterPackSetParser: IBoosterPackSetParser;
    boosterPackRetriever: IBoosterPackRetriever;
    fileReader: IFileReader;
    htmlDownloader: IHtmlAccessor;
  }) {
    this.boosterPackSetParser = params.boosterPackSetParser;
    this.boosterPackRetriever = params.boosterPackRetriever;
    this.fileReader = params.fileReader;
    this.htmlDownloader = params.htmlDownloader;
  }

  public readonly retrieveBoosterPackSets: IBoosterPackSetRetriever['retrieveBoosterPackSets'] =
    async ({}) => {
      const path = CardConstants.BOOSTER_PACK_SETS_PATH;

      await this.htmlDownloader.downloadHtmlToFile({
        mode: FILE_WRITE_MODES.DoNotOverwrite,
        path,
        url: CardConstants.BOOSTER_PACK_SETS_URL,
      });
      const { contents } = await this.fileReader.readFromFile({
        path,
      });
      const { parsedBoosterPackSets } = this.boosterPackSetParser.parseBoosterPackSets({
        data: contents,
      });
      const sortedBoosterPackSets = SortUtils.sortByString(
        parsedBoosterPackSets,
        ({ id }) => id,
      ).filter(({ id }) => !id.startsWith('P-'));

      const boosterPackSets: Array<BoosterPackSet> = [];
      for (const parsedBoosterPackSet of sortedBoosterPackSets) {
        console.log(`Retrieving booster pack set ${parsedBoosterPackSet.id}...`);
        const { boosterPacks } = await this.boosterPackRetriever.retrieveBoosterPacks({
          cardCount: parsedBoosterPackSet.cardCount,
          packSetId: parsedBoosterPackSet.id,
        });

        boosterPackSets.push({
          ...parsedBoosterPackSet,
          packs: boosterPacks,
        });
      }

      return { boosterPackSets };
    };
}
