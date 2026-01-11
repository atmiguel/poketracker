import type { Path } from '../../path/types';
import type { FileWriteMode } from '../types';

export interface IHtmlAccessor {
  downloadHtmlToFile: (params: { mode: FileWriteMode; path: Path; url: string }) => Promise<void>;
}
