import type { Path } from '../../types/path';

export interface IFileReader {
  readFromFile: (params: { path: Path }) => Promise<{ contents: string }>;
}
