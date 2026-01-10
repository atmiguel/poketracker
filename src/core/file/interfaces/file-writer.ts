import type { Path } from '../../path/types';
import type { FileWriteMode } from '../types';

export interface IFileWriter {
  writeToFile: (params: { contents: string; mode: FileWriteMode; path: Path }) => Promise<void>;
}
