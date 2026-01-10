import type { Path } from '../../path/types';

export interface IFileReader {
  readFromFile: (params: { path: Path }) => Promise<{ contents: string }>;
}
