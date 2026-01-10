import type { FileWriteMode } from '../../file/types';
import type { Path } from '../../path/types';

export interface IHtmlDownloader {
  downloadHtmlToFile: (params: { mode: FileWriteMode; path: Path; url: string }) => Promise<void>;
}
