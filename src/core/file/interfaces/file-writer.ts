import type { Path } from '../../path/types';

export interface IFileWriter {
  writeToFile: (params: { contents: string; path: Path }) => Promise<void>;
}
