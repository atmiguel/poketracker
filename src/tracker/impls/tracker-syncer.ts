import { CardInstances } from '../../card/instances';
import type { IBoosterPackSetRetriever } from '../../card/interfaces/booster-pack-set-retriever';
import { BoosterPack, BoosterPackSet, CARD_RARITY_SYMBOLS, CardRaritySymbol, type Card } from '../../card/types';
import { SpreadsheetManager } from '../../core/google/impls/spreadsheet-manager';
import type { ISheetReader } from '../../core/google/interfaces/sheet-reader';
import type { ISheetWriter } from '../../core/google/interfaces/sheet-writer';
import type { Sheet } from '../../core/google/types';
import { SortUtils } from '../../core/sort/utils';
import type { Nullable } from '../../core/types';
import { CoreUtils } from '../../core/utils';
import type { ITrackerSyncer } from '../interfaces/tracker-syncer';

type SheetMetadata = { id: number; index: number };
type CardWithMetadata = Card & { packNames: Array<Nullable<string>> };

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
    cardCount,
    packs,
  }: {
    cardCount: number;
    packs: Array<BoosterPack>;
  }): { cards: Array<CardWithMetadata> } => {
    const cardsByNumber: Map<number, CardWithMetadata> = new Map();
    for (const pack of packs) {
      for (const card of pack.cards) {
        const cardWithMetadata = cardsByNumber.get(card.number) ?? null;

        if (cardWithMetadata === null) {
          cardsByNumber.set(card.number, {
            ...card,
            packNames: [pack.name],
          });
        } else {
          cardsByNumber.set(card.number, {
            ...cardWithMetadata,
            packNames: [
              ...cardWithMetadata.packNames,
              pack.name,
            ],
          });
        }
      }
    }

    const cards: Array<CardWithMetadata> = CoreUtils.range(cardCount).map(
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
        columnCount: 1,
        rowCount: cardCount,
        sheetId,
        startColumnIndex: 0,
        startRowIndex: 2,
      });
    } else {
      // TODO: ensure column is set correctly
    }
  };

  private static readonly constructPackHeader = ({ packName } : { packName: Nullable<string> }): string => {
    if (packName === null) {
      return 'inPack';
    }

    return `in${packName.replace(' ', '').replace('-', '')}Pack`;
  };

  private readonly syncNonOwnedColumns = async ({
    cardCount,
    packs,
    setId,
    sheetId,
    sheetName,
  }: {
    cardCount: number;
    packs: Array<BoosterPack>;
    setId: string;
    sheetId: number;
    sheetName: string;
  }): Promise<void> => {
    const { cards } = TrackerSyncer.extractCards({ cardCount, packs });

    // await this.sheetWriter.overwriteSheetData({
    //   range: 'B2',
    //   rows: [
    //     [
    //       'id',
    //       'name',
    //       'rarityCount',
    //       'raritySymbol',
    //       ...packs.map((pack) => TrackerSyncer.constructPackHeader({ packName: pack.name })),
    //     ],
    //     ...cards.map((card) => [
    //       `${setId} ${card.number.toString().padStart(3, '0')}`,
    //       card.name,
    //       card.rarity.count,
    //       card.rarity.symbol,
    //       ...packs.map((pack) => card.packNames.includes(pack.name)),
    //     ]),
    //   ],
    //   sheetName,
    // });

    // await this.sheetWriter.setCellsToCheckboxes({
    //   columnCount: packs.length,
    //   rowCount: cardCount,
    //   sheetId,
    //   startColumnIndex: 5,
    //   startRowIndex: 2,
    // });
  };

  private static readonly constructSheetMetadataByName = ({ sheets }: { sheets: Array<Sheet> }): Map<string, SheetMetadata> => {
    return sheets.reduce((accumulator, sheet, index) => {
      accumulator.set(sheet.name, { id: sheet.id, index });
      return accumulator;
    }, new Map<string, SheetMetadata>());
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
    const sheetMetadataByName = TrackerSyncer.constructSheetMetadataByName({ sheets });

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
      cardCount: boosterPackSet.cardCount,
      packs: boosterPackSet.packs,
      setId,
      sheetId: sheetMetadata.id,
      sheetName,
    });
  };

  private readonly appendSheetIfMissing = async ({ sheetName }: { sheetName: string }): Promise<{ sheetId: number }> => {
    const { sheets } = await this.sheetReader.listSheets({});
    const sheetMetadataByName = TrackerSyncer.constructSheetMetadataByName({ sheets });

    let sheetId = sheetMetadataByName.get(sheetName)?.id ?? null;
    if (sheetId === null) {
      // sheet missing
      console.log(`Creating sheet ${sheetName}...`);
      const result = await this.sheetWriter.appendSheet({ name: sheetName });
      sheetId = result.sheetId;
    }
    
    return { sheetId };
  };

  private readonly syncSetStatsSheet = async ({
    boosterPackSets,
  }: {
    boosterPackSets: Array<BoosterPackSet>;
  }) => {
    const sheetName = 'SetStats';
    const { sheetId } = await this.appendSheetIfMissing({ sheetName });

    await this.sheetWriter.freezeRows({ count: 1, sheetId });

    await this.sheetWriter.overwriteSheetData({
      range: 'A1',
      rows: [
        ['setId', 'setName', 'ownedCount', 'totalCount', 'ownedPercent'],
        ...boosterPackSets.map((boosterPackSet) => {
          return [
            boosterPackSet.id,
            boosterPackSet.name,
            `=COUNTIF('${boosterPackSet.id}'!A3:A, TRUE)`,
            boosterPackSet.cardCount,
            TrackerSyncer.getDivideFormula({
              numeratorColumnId: 'C',
              denominatorColumnId: 'D',
            }),
          ];
        }),
      ],
      sheetName,
    });

    await this.sheetWriter.formatColumnAsPercent({
      columnIndex: 4,
      sheetId,
    });
  };

  private static readonly getCountIfOwnedParams = ({ setId }: { setId: string }): string => {
    return `'${setId}'!A3:A, TRUE`;
  };

  private static readonly getCountIfRaritySymbolParams = ({ raritySymbol, setId }: { raritySymbol: CardRaritySymbol; setId: string }): string => {
    return `'${setId}'!E3:E, "${raritySymbol}"`;
  };

  private static readonly getCountIfInPackParams = ({ packColumnId, setId }: { packColumnId: string; setId: string }): string => {
    return `'${setId}'!${packColumnId}3:${packColumnId}, TRUE`;
  };

  private static readonly combineCountIfParams = (params: Array<string>): string => {
    return `=COUNTIFS(${params.join(', ')})`;
  };

  private readonly syncSetRarityStatsSheet = async ({
    boosterPackSets,
  }: {
    boosterPackSets: Array<BoosterPackSet>;
  }) => {
    const sheetName = 'SetRarityStats';
    const { sheetId } = await this.appendSheetIfMissing({ sheetName });

    await this.sheetWriter.freezeRows({ count: 1, sheetId });

    await this.sheetWriter.overwriteSheetData({
      range: 'A1',
      rows: [
        ['setId', 'setName', 'raritySymbol', 'ownedCount', 'totalCount', 'ownedPercent'],
        ...boosterPackSets.flatMap((boosterPackSet) => {
          return CardRaritySymbol.options.map((raritySymbol) => {
            return [
              boosterPackSet.id,
              boosterPackSet.name,
              raritySymbol,
              TrackerSyncer.combineCountIfParams([
                TrackerSyncer.getCountIfOwnedParams({ setId: boosterPackSet.id }),
                TrackerSyncer.getCountIfRaritySymbolParams({ raritySymbol, setId: boosterPackSet.id }),
              ]),
              TrackerSyncer.combineCountIfParams([
                TrackerSyncer.getCountIfRaritySymbolParams({ raritySymbol, setId: boosterPackSet.id }),
              ]),
              TrackerSyncer.getDivideFormula({
                numeratorColumnId: 'D',
                denominatorColumnId: 'E',
              }),
            ];
          });
        }),
      ],
      sheetName,
    });

    await this.sheetWriter.formatColumnAsPercent({
      columnIndex: 5,
      sheetId,
    });
  };

  private readonly syncVerificationSheet = async ({
    boosterPackSets,
  }: {
    boosterPackSets: Array<BoosterPackSet>;
  }) => {
    const sheetName = 'Verification';
    const { sheetId } = await this.appendSheetIfMissing({ sheetName });

    await this.sheetWriter.freezeRows({ count: 1, sheetId });

    await this.sheetWriter.overwriteSheetData({
      range: 'A1',
      rows: [
        ['setId', 'setName', 'diamondCount', 'starCount', 'shinyCount', 'crownCount'],
        ...boosterPackSets.map((boosterPackSet) => {
          return [
            boosterPackSet.id,
            boosterPackSet.name,
            ...[
              CARD_RARITY_SYMBOLS.Diamond,
              CARD_RARITY_SYMBOLS.Star,
              CARD_RARITY_SYMBOLS.Shiny,
              CARD_RARITY_SYMBOLS.Crown,
            ].map((raritySymbol) => TrackerSyncer.combineCountIfParams([
              TrackerSyncer.getCountIfOwnedParams({ setId: boosterPackSet.id }),
              TrackerSyncer.getCountIfRaritySymbolParams({ raritySymbol, setId: boosterPackSet.id }),
            ])),
          ];
        }),
      ],
      sheetName,
    });
  };

  private static readonly getDivideFormula = ({ numeratorColumnId, denominatorColumnId }: { numeratorColumnId: string; denominatorColumnId: string }): string => {
    return `=IFERROR(INDEX(${numeratorColumnId}:${numeratorColumnId}, ROW())/INDEX(${denominatorColumnId}:${denominatorColumnId}, ROW()), 0)`;
  };

  private readonly syncPackStatsSheet = async ({
    boosterPackSets,
  }: {
    boosterPackSets: Array<BoosterPackSet>;
  }) => {
    const sheetName = 'PackStats';
    const { sheetId } = await this.appendSheetIfMissing({ sheetName });

    await this.sheetWriter.freezeRows({ count: 1, sheetId });

    await this.sheetWriter.overwriteSheetData({
      range: 'A1',
      rows: [
        ['setId', 'setName', 'packName', 'ownedCount', 'totalCount', 'ownedPercent'],
        ...boosterPackSets.flatMap((boosterPackSet) => {
          return boosterPackSet.packs.map((pack, packIndex) => {
            const packColumnId = 'FGH'[packIndex]!;

            return [
              boosterPackSet.id,
              boosterPackSet.name,
              pack.name,
              TrackerSyncer.combineCountIfParams([
                TrackerSyncer.getCountIfOwnedParams({ setId: boosterPackSet.id }),
                TrackerSyncer.getCountIfInPackParams({ packColumnId, setId: boosterPackSet.id }),
              ]),
              TrackerSyncer.combineCountIfParams([
                TrackerSyncer.getCountIfInPackParams({ packColumnId, setId: boosterPackSet.id }),
              ]),
              TrackerSyncer.getDivideFormula({
                numeratorColumnId: 'D',
                denominatorColumnId: 'E',
              }),
            ];
          });
        }),
      ],
      sheetName,
    });

    await this.sheetWriter.formatColumnAsPercent({
      columnIndex: 5,
      sheetId,
    });
  };

  private readonly syncPackRarityStatsSheet = async ({
    boosterPackSets,
  }: {
    boosterPackSets: Array<BoosterPackSet>;
  }) => {
    const sheetName = 'PackRarityStats';
    const { sheetId } = await this.appendSheetIfMissing({ sheetName });

    await this.sheetWriter.freezeRows({ count: 1, sheetId });

    await this.sheetWriter.overwriteSheetData({
      range: 'A1',
      rows: [
        ['setId', 'setName', 'packName', 'raritySymbol', 'ownedCount', 'totalCount', 'ownedPercent'],
        ...boosterPackSets.flatMap((boosterPackSet) => {
          return boosterPackSet.packs.flatMap((pack, packIndex) => {
            const packColumnId = 'FGH'[packIndex]!;

            return CardRaritySymbol.options.map((raritySymbol) => {
              return [
                boosterPackSet.id,
                boosterPackSet.name,
                pack.name,
                raritySymbol,
                TrackerSyncer.combineCountIfParams([
                  TrackerSyncer.getCountIfOwnedParams({ setId: boosterPackSet.id }),
                  TrackerSyncer.getCountIfInPackParams({ packColumnId, setId: boosterPackSet.id }),
                  TrackerSyncer.getCountIfRaritySymbolParams({ raritySymbol, setId: boosterPackSet.id }),
                ]),
                TrackerSyncer.combineCountIfParams([
                  TrackerSyncer.getCountIfInPackParams({ packColumnId, setId: boosterPackSet.id }),
                  TrackerSyncer.getCountIfRaritySymbolParams({ raritySymbol, setId: boosterPackSet.id }),
                ]),
                TrackerSyncer.getDivideFormula({
                  numeratorColumnId: 'E',
                  denominatorColumnId: 'F',
                }),
              ];
            });
          });
        }),
      ],
      sheetName,
    });

    await this.sheetWriter.formatColumnAsPercent({
      columnIndex: 6,
      sheetId,
    });
  };

  public readonly syncTracker: ITrackerSyncer['syncTracker'] = async ({}) => {
    let { boosterPackSets } = await this.boosterPackSetRetriever.retrieveBoosterPackSets({});
    boosterPackSets = SortUtils.sortByString(boosterPackSets, (o) => o.id).reverse();

    for (const [setIndex, boosterPackSet] of boosterPackSets.entries()) {
      console.log(`Syncing set ${boosterPackSet.id}...`);
      await this.syncBoosterPackSet({ boosterPackSet, setId: boosterPackSet.id, setIndex });
    }

    await this.syncVerificationSheet({ boosterPackSets });
    await this.syncSetStatsSheet({ boosterPackSets });
    await this.syncSetRarityStatsSheet({ boosterPackSets });
    await this.syncPackStatsSheet({ boosterPackSets });
    await this.syncPackRarityStatsSheet({ boosterPackSets });
  };
}
