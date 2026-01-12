import type { Sheet } from '../types';

export interface ISheetReader {
  listSheets: (params: {}) => Promise<{ sheets: Array<Sheet> }>;

  readSheetData: (params: {
    sheetId: number;
  }) => Promise<Array<Array<unknown>>>;
}
