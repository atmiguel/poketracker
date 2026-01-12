export interface ISheetWriter {
  addSheet: (params: { name: string }) => Promise<void>;

  insertSheet: (params: { index: number; name: string }) => Promise<void>;

  overwriteSheetData: (params: {
    data: Array<Array<unknown>>;
    range: string;
    sheetId: number;
  }) => Promise<void>;
}
