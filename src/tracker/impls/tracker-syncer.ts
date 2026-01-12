import { CardInstances } from '../../card/instances';
import type { IBoosterPackSetRetriever } from '../../card/interfaces/booster-pack-set-retriever';
import { SpreadsheetManager } from '../../core/google/impls/spreadsheet-manager';
import type { ISheetReader } from '../../core/google/interfaces/sheet-reader';
import type { ISheetWriter } from '../../core/google/interfaces/sheet-writer';
import { SortUtils } from '../../core/sort/utils';
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

  public static readonly create = ({spreadsheetId}: {spreadsheetId: string}): TrackerSyncer => {
    const spreadsheetManager = SpreadsheetManager.create({ spreadsheetId });

    return new TrackerSyncer({
      boosterPackSetRetriever: CardInstances.boosterPackSetRetriever,
      sheetReader: spreadsheetManager,
      sheetWriter: spreadsheetManager,
    });
  };

  public readonly syncTracker: ITrackerSyncer['syncTracker'] = async ({}) => {
    const { boosterPackSets } = await this.boosterPackSetRetriever.retrieveBoosterPackSets({});
    const sortedBoosterPackSets = SortUtils.sortByString(boosterPackSets, (o) => o.id).reverse();
    // const { sheets } = await this.sheetReader.listSheets({});

    for (const boosterPackSet of sortedBoosterPackSets) {
      console.log(boosterPackSet.id);
    }
  };
}
