import type { Path } from '../../path/types';

export interface IFileChecker {
  checkFileExists: (params: { path: Path }) => Promise<{ fileExists: boolean }>;
}
