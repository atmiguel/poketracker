export interface IHtmlDownloader {
  downloadHtml: (params: {
    destinationFilepath: string;
    url: string;
    options?: {
      shouldOverwrite?: boolean;
    };
  }) => Promise<void>;
}
