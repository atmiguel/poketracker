import axios from 'axios';

import type { IHtmlDownloader } from '../interfaces/html-downloader';
import type { IFileWriter } from '../../file/interfaces/file-writer';

export class HtmlDownloader implements IHtmlDownloader {
  private readonly fileWriter: IFileWriter;

  public constructor(params: { fileWriter: IFileWriter }) {
    this.fileWriter = params.fileWriter;
  }

  public readonly downloadHtmlToFile: IHtmlDownloader['downloadHtmlToFile'] = async ({
    mode,
    path,
    url,
  }): Promise<void> => {
    const { data } = await axios.get(url);

    await this.fileWriter.writeToFile({
      contents: data,
      mode,
      path,
    });
  };
}
