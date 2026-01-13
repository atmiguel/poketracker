export interface ISheetWriter {
  addSheet: (params: { name: string }) => Promise<void>;

  insertSheet: (params: { index: number; name: string }) => Promise<void>;

  overwriteSheetData: (params: {
    range: string;
    rows: Array<Array<unknown>>;
    sheetName: string;
  }) => Promise<void>;

  setColumnAsCheckboxes: (params: {
    columnIndex: number;
    sheetId: number;
    startRowIndex: number;
  }) => Promise<void>;
}
