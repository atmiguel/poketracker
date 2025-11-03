export interface IHtmlDownloader {
  downloadHtml: (params: {
    destinationFilepath: string;
    shouldOverwrite: boolean;
    url: string;
  }) => Promise<void>;
}
