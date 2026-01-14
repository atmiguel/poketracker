export interface ISheetWriter {
  appendSheet: (params: { name: string }) => Promise<{ sheetId: number }>;

  insertSheet: (params: { index: number; name: string }) => Promise<{ sheetId: number }>;

  overwriteSheetData: (params: {
    range: string;
    rows: Array<Array<unknown>>;
    sheetName: string;
  }) => Promise<void>;

  setCellsToCheckboxes: (params: {
    columnIndex: number;
    count: number;
    sheetId: number;
    startRowIndex: number;
  }) => Promise<void>;

  freezeRows: (params: { count: number; sheetId: number }) => Promise<void>;

  formatColumnAsPercent: (params: {
    columnIndex: number
    sheetId: number,
  }) => Promise<void>;
}
