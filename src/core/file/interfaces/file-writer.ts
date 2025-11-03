import type { Path } from "../../types/path";

export interface IFileWriter {
  writeToFile: (params: {
    contents: string;
    destinationPath: Path;
    options?: {
      shouldOverwrite?: boolean;
    };
  }) => Promise<void>;
}
