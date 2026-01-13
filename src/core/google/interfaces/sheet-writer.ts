export interface ISheetWriter {
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
}
