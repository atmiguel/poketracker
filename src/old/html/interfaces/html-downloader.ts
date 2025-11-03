export interface IHtmlDownloader {
  downloadHtml: (params: {
    destinationFilepath: string;
    url: string;
  }) => Promise<void>;
}
