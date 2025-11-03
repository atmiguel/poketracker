import type { Path } from "../../types/path";

export interface IHtmlDownloader {
  downloadHtml: (params: {
    destinationPath: Path;
    url: string;
    options?: {
      shouldOverwrite?: boolean;
    };
  }) => Promise<void>;
}
