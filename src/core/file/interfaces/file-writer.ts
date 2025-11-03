export interface IFileWriter {
  writeToFile: (params: { contents: string; destinationFilepath: string }) => Promise<void>;
}
