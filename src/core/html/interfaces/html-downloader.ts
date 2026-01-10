import type { Path } from '../../path/types';

export interface IHtmlDownloader {
  downloadHtml: (params: {
    path: Path;
    url: string;
    options?: {
      shouldOverwrite?: boolean;
    };
  }) => Promise<void>;
}
