import axios from 'axios';

import type { IHtmlDownloader } from '../interfaces/html-downloader';
import type { Nullable } from '../../types/constants';
import type { IFileWriter } from '../../file/interfaces/file-writer';
import { FileManager } from '../../file/impls/file-manager';

export class HtmlDownloader implements IHtmlDownloader {
  private static instance: Nullable<HtmlDownloader> = null;

  private readonly fileWriter: IFileWriter;

  private constructor(params: { fileWriter: IFileWriter }) {
    this.fileWriter = params.fileWriter;
  }

  private static readonly createInstance = (): HtmlDownloader => {
    return new HtmlDownloader({
      fileWriter: FileManager.getInstance(),
    });
  };

  public static readonly getInstance = (): HtmlDownloader => {
    if (HtmlDownloader.instance === null) {
      HtmlDownloader.instance = HtmlDownloader.createInstance();
    }

    return HtmlDownloader.instance;
  };

  public readonly downloadHtml: IHtmlDownloader['downloadHtml'] = async ({
    destinationPath,
    options,
    url,
  }): Promise<void> => {
    const { shouldOverwrite = false } = options ?? {};

    const { data } = await axios.get(url);

    await this.fileWriter.writeToFile({
      contents: data,
      destinationPath,
      options: {
        shouldOverwrite,
      },
    });
  };
}
