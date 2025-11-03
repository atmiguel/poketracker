export interface IFileWriter {
  writeToFile: (params: {
    contents: string;
    destinationFilepath: string;
    options?: {
      shouldOverwrite?: boolean;
    }
  }) => Promise<void>;
}
