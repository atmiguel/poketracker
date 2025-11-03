import axios from 'axios';

import type { IHtmlDownloader } from "../interfaces/html-downloader";

export class HtmlDownloader implements IHtmlDownloader {
  public readonly downloadHtml: IHtmlDownloader['downloadHtml'] = async ({
    destinationFilepath,
    url,
  }): Promise<void> => {
    const { data } = await axios.get(url);

    console.log(destinationFilepath);
    console.log(data);
  };
}
