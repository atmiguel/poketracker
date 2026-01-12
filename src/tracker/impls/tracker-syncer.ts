import { CardInstances } from '../../card/instances';
import type { IBoosterPackSetRetriever } from '../../card/interfaces/booster-pack-set-retriever';
import type { BoosterPackSet } from '../../card/types';
import { SpreadsheetManager } from '../../core/google/impls/spreadsheet-manager';
import type { ISheetReader } from '../../core/google/interfaces/sheet-reader';
import type { ISheetWriter } from '../../core/google/interfaces/sheet-writer';
import { SortUtils } from '../../core/sort/utils';
import { CoreUtils } from '../../core/utils';
import type { ITrackerSyncer } from '../interfaces/tracker-syncer';

/*

pseudo-code:

- for each set:
  - check if sheet exists
    - if not, create sheet
  - if so, ensure sheet in correct spot
  - ensure sheet has correct data
    - check header (owned, number, name)
    - check column values
      - owned should be booleans
      - numbers and names should be all present

Notes:
- optionally error if additional sheets exist?
- ensure sheets are set up correctly in reverse order
  - B1: blah, A4a: blah, A4: sure, etc.
  - error if any sheets have unexpected name
  - add missing sheet to front if needed

*/
export class TrackerSyncer implements ITrackerSyncer {
  private readonly boosterPackSetRetriever: IBoosterPackSetRetriever;
  private readonly sheetReader: ISheetReader;
  private readonly sheetWriter: ISheetWriter;

  private constructor(params: {
    boosterPackSetRetriever: IBoosterPackSetRetriever;
    sheetReader: ISheetReader;
    sheetWriter: ISheetWriter;
  }) {
    this.boosterPackSetRetriever = params.boosterPackSetRetriever;
    this.sheetReader = params.sheetReader;
    this.sheetWriter = params.sheetWriter;
  }

  public static readonly create = ({ spreadsheetId }: { spreadsheetId: string }): TrackerSyncer => {
    const spreadsheetManager = SpreadsheetManager.create({ spreadsheetId });

    return new TrackerSyncer({
      boosterPackSetRetriever: CardInstances.boosterPackSetRetriever,
      sheetReader: spreadsheetManager,
      sheetWriter: spreadsheetManager,
    });
  };

  private readonly syncOwnedColumn = async ({ cardCount, sheetName }: { cardCount: number; sheetName: string}): Promise<void> => {
    const { rows } = await this.sheetReader.readSheetData({ range: 'A:A', sheetName });

    if (rows.length === 0) {
      // empty column
      await this.sheetWriter.overwriteSheetData({
        range: 'A:A',
        rows: [
          ['isOwned'],
          ...CoreUtils.range(cardCount).map(() => [false]),
        ],
        sheetName,
      });
    } else {
      // TODO: ensure column is set correctly
    }
  };

  private readonly syncBoosterPackSet = async ({
    boosterPackSet,
    setIndex,
  }: {
    boosterPackSet: BoosterPackSet;
    setIndex: number;
  }): Promise<void> => {
    const { sheets } = await this.sheetReader.listSheets({});

    const sheetName = `${boosterPackSet.id}: ${boosterPackSet.name}`;
    const sheetIndex = sheets.map((o) => o.name).indexOf(sheetName);

    if (sheetIndex < 0) {
      // sheet missing
      console.log(`Creating sheet ${sheetName}...`);
      await this.sheetWriter.insertSheet({ index: setIndex, name: sheetName });
    } else {
      if (sheetIndex !== setIndex) {
        throw new Error('expected sheet indices to match');
      }
    }

    await this.syncOwnedColumn({ cardCount: boosterPackSet.cardCount, sheetName });
  };

  public readonly syncTracker: ITrackerSyncer['syncTracker'] = async ({}) => {
    const { boosterPackSets } = await this.boosterPackSetRetriever.retrieveBoosterPackSets({});
    const sortedBoosterPackSets = SortUtils.sortByString(boosterPackSets, (o) => o.id).reverse();

    for (const [setIndex, boosterPackSet] of sortedBoosterPackSets.entries()) {
      console.log(`Syncing set ${boosterPackSet.id}...`);
      await this.syncBoosterPackSet({ boosterPackSet, setIndex });
    }
  };
}
