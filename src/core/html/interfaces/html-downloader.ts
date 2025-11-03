import type { Path } from '../../types/path';

export interface IHtmlDownloader {
  downloadHtml: (params: {
    path: Path;
    url: string;
    options?: {
      shouldOverwrite?: boolean;
    };
  }) => Promise<void>;
}
