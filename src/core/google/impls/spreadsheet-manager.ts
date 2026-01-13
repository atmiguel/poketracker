import { CoreConstants } from '../../constants';
import { Path } from '../../path/types';
import type { ISheetReader } from '../interfaces/sheet-reader';
import { google, sheets_v4 } from 'googleapis';
import { SortUtils } from '../../sort/utils';
import type { Sheet } from '../types';
import type { ISheetWriter } from '../interfaces/sheet-writer';

export class SpreadsheetManager implements ISheetReader, ISheetWriter {
  private readonly sheetsApi: sheets_v4.Sheets;
  private readonly spreadsheetId: string;

  private constructor(params: { sheetsApi: sheets_v4.Sheets; spreadsheetId: string }) {
    this.sheetsApi = params.sheetsApi;
    this.spreadsheetId = params.spreadsheetId;
  }

  public static readonly create = ({
    spreadsheetId,
  }: {
    spreadsheetId: string;
  }): SpreadsheetManager => {
    const auth = new google.auth.GoogleAuth({
      keyFile: Path.create(`${CoreConstants.CREDENTIALS_PATH}/service-account.json`).toString(),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheetsApi: sheets_v4.Sheets = google.sheets({
      version: 'v4',
      auth,
    });

    return new SpreadsheetManager({
      sheetsApi,
      spreadsheetId,
    });
  };

  public readonly listSheets: ISheetReader['listSheets'] = async ({}) => {
    const result = await this.sheetsApi.spreadsheets.get({ spreadsheetId: this.spreadsheetId });

    const sheets = SortUtils.sortByNumber(
      result.data.sheets!.map((o) => o.properties!),
      (o) => o.index!,
    ).map(
      (o): Sheet => ({
        id: o.sheetId!,
        name: o.title!,
      }),
    );

    return { sheets };
  };

  public readonly readSheetData: ISheetReader['readSheetData'] = async ({ range, sheetName }) => {
    const response = await this.sheetsApi.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!${range}`,
    });

    const rows = response.data.values ?? [];
    return { rows };
  };

  public readonly insertSheet: ISheetWriter['insertSheet'] = async ({ index, name }) => {
    const response = await this.sheetsApi.spreadsheets.batchUpdate({
      spreadsheetId: this.spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: name,
                index,
              },
            },
          },
        ],
      },
    });

    const sheetId = response.data.replies![0]?.addSheet?.properties?.sheetId!;
    return { sheetId };
  };

  public readonly overwriteSheetData: ISheetWriter['overwriteSheetData'] = async ({
    range,
    rows,
    sheetName,
  }) => {
    await this.sheetsApi.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!${range}`,
      valueInputOption: 'USER_ENTERED', // or 'RAW'
      requestBody: {
        values: rows,
      },
    });
  };

  public readonly setCellsToCheckboxes: ISheetWriter['setCellsToCheckboxes'] = async ({ columnIndex, count, sheetId, startRowIndex }) => {
    await this.sheetsApi.spreadsheets.batchUpdate({
      spreadsheetId: this.spreadsheetId,
      requestBody: {
        requests: [
          {
            setDataValidation: {
              range: {
                sheetId,
                startRowIndex,
                endRowIndex: startRowIndex + count,
                startColumnIndex: columnIndex,
                endColumnIndex: columnIndex + 1,
              },
              rule: {
                condition: {
                  type: 'BOOLEAN',
                },
                strict: true,
                showCustomUi: true,
              },
            },
          },
        ],
      },
    });
  }
}
