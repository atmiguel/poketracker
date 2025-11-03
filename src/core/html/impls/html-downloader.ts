import axios from 'axios';

import type { IHtmlDownloader } from '../interfaces/html-downloader';
import type { Nullable } from '../../types/constants';
import type { IFileWriter } from '../../file/interfaces/file-writer';
import { FileWriter } from '../../file/impls/file-writer';
import type { IFileChecker } from '../../file/interfaces/file-checker';
import { FileChecker } from '../../file/impls/file-checker';

export class HtmlDownloader implements IHtmlDownloader {
  private static instance: Nullable<HtmlDownloader> = null;

  private readonly fileChecker: IFileChecker;
  private readonly fileWriter: IFileWriter;

  private constructor(params: {
    fileChecker: IFileChecker;
    fileWriter: IFileWriter;
  }) {
    this.fileWriter = params.fileWriter;
  }

  private static readonly createInstance = (): HtmlDownloader => {
    return new HtmlDownloader({
      fileChecker: FileChecker.getInstance(),
      fileWriter: FileWriter.getInstance(),
    });
  }

  public static readonly getInstance = (): HtmlDownloader => {
    if (HtmlDownloader.instance === null) {
      HtmlDownloader.instance = HtmlDownloader.createInstance();
    }

    return HtmlDownloader.instance;
  }

  public readonly downloadHtml: IHtmlDownloader['downloadHtml'] = async ({
    destinationFilepath,
    shouldOverwrite,
    url,
  }): Promise<void> => {
    const { data } = await axios.get(url);

    if (!shouldOverwrite) {
      if (await this.fileChecker.checkFileExists({ filepath: destinationFilepath })) {
        return;
      }
    }

    await this.fileWriter.writeToFile({
      contents: data,
      destinationFilepath,
    });
  };
}
