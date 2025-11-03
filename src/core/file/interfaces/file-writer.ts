import type { Path } from '../../types/path';

export interface IFileWriter {
  writeToFile: (params: {
    contents: string;
    path: Path;
    options?: {
      shouldOverwrite?: boolean;
    };
  }) => Promise<void>;
}
