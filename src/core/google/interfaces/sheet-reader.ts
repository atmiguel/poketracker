import type { Sheet } from '../types';

export interface ISheetReader {
  listSheets: (params: {}) => Promise<{ sheets: Array<Sheet> }>;

  readSheetData: (params: {
    range: string;
    sheetName: string;
  }) => Promise<{ rows: Array<Array<unknown>> }>;
}
