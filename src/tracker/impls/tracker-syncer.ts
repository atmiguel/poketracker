import { CardInstances } from '../../card/instances';
import type { IBoosterPackSetRetriever } from '../../card/interfaces/booster-pack-set-retriever';
import { BoosterPackSet, type Card } from '../../card/types';
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

  private static readonly extractCards = ({
    boosterPackSet,
  }: {
    boosterPackSet: BoosterPackSet;
  }): { cards: Array<Card> } => {
    const cardsByNumber: Map<number, Card> = new Map();
    for (const pack of boosterPackSet.packs) {
      for (const card of pack.cards) {
        if (!cardsByNumber.has(card.number)) {
          cardsByNumber.set(card.number, card);
        }
      }
    }

    const cards: Array<Card> = CoreUtils.range(boosterPackSet.cardCount).map(
      (i) => cardsByNumber.get(i + 1)!,
    );
    return { cards };
  };

  private readonly syncOwnedColumn = async ({
    cardCount,
    sheetId,
    sheetName,
  }: {
    cardCount: number;
    sheetId: number;
    sheetName: string;
  }): Promise<void> => {
    const range = 'A2:A';
    const { rows } = await this.sheetReader.readSheetData({ range, sheetName });

    if (rows.length === 0) {
      // empty column
      await this.sheetWriter.overwriteSheetData({
        range,
        rows: [['isOwned'], ...CoreUtils.range(cardCount).map(() => [false])],
        sheetName,
      });

      await this.sheetWriter.setCellsToCheckboxes({
        columnIndex: 0,
        count: cardCount,
        sheetId,
        startRowIndex: 2,
      });
    } else {
      // TODO: ensure column is set correctly
    }
  };

  private readonly syncNonOwnedColumns = async ({
    cards,
    setId,
    sheetName,
  }: {
    cards: Array<Card>;
    setId: string;
    sheetName: string;
  }): Promise<void> => {
    const range = 'B2:C';
    const { rows } = await this.sheetReader.readSheetData({ range, sheetName });

    if (rows.length === 0) {
      // empty columns
      await this.sheetWriter.overwriteSheetData({
        range,
        rows: [
          ['id', 'name'],
          ...cards.map((card) => [
            `${setId} ${card.number.toString().padStart(3, '0')}`,
            card.name,
          ]),
        ],
        sheetName,
      });
    } else {
      // TODO: ensure columns are set correctly
    }
  };

  private readonly syncBoosterPackSet = async ({
    boosterPackSet,
    setId,
    setIndex,
  }: {
    boosterPackSet: BoosterPackSet;
    setId: string;
    setIndex: number;
  }): Promise<void> => {
    const { sheets } = await this.sheetReader.listSheets({});
    const sheetMetadataByName = sheets.reduce((accumulator, sheet, index) => {
      accumulator.set(sheet.name, { id: sheet.id, index });
      return accumulator;
    }, new Map<string, { id: number; index: number }>());

    const sheetName = boosterPackSet.id;
    let sheetMetadata = sheetMetadataByName.get(sheetName) ?? null;

    if (sheetMetadata === null) {
      // sheet missing
      console.log(`Creating sheet ${sheetName}...`);
      const result = await this.sheetWriter.insertSheet({ index: setIndex, name: sheetName });
      sheetMetadata = {
        id: result.sheetId,
        index: setIndex,
      };

      await this.sheetWriter.freezeRows({ count: 2, sheetId: result.sheetId });
    } else {
      if (sheetMetadata.index !== setIndex) {
        throw new Error('expected sheet indices to match');
      }
    }

    await this.sheetWriter.overwriteSheetData({
      range: 'A1',
      rows: [[boosterPackSet.name]],
      sheetName,
    });
    await this.syncOwnedColumn({
      cardCount: boosterPackSet.cardCount,
      sheetId: sheetMetadata.id,
      sheetName,
    });
    await this.syncNonOwnedColumns({
      cards: TrackerSyncer.extractCards({ boosterPackSet }).cards,
      setId,
      sheetName,
    });
  };

  private readonly syncStatsSheet = async ({
    boosterPackSets,
  }: {
    boosterPackSets: Array<BoosterPackSet>;
  }) => {};

  public readonly syncTracker: ITrackerSyncer['syncTracker'] = async ({}) => {
    const { boosterPackSets } = await this.boosterPackSetRetriever.retrieveBoosterPackSets({});
    const sortedBoosterPackSets = SortUtils.sortByString(boosterPackSets, (o) => o.id).reverse();

    // for (const [setIndex, boosterPackSet] of sortedBoosterPackSets.entries()) {
    //   console.log(`Syncing set ${boosterPackSet.id}...`);
    //   await this.syncBoosterPackSet({ boosterPackSet, setId: boosterPackSet.id, setIndex });
    // }

    await this.syncStatsSheet({ boosterPackSets: sortedBoosterPackSets });
  };
}
