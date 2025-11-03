import axios from 'axios';
import { writeFile } from "fs/promises";

import type { IHtmlDownloader } from '../interfaces/html-downloader';
import type { Nullable } from '../../types/constants';
import type { IFileWriter } from '../../file/interfaces/file-writer';
import { FileWriter } from '../../file/impls/file-writer';

export class HtmlDownloader implements IHtmlDownloader {
  private static instance: Nullable<HtmlDownloader> = null;

  private readonly fileWriter: IFileWriter;

  private constructor(params: { fileWriter: IFileWriter }) {
    this.fileWriter = params.fileWriter;
  }

  private static readonly createInstance = (): HtmlDownloader => {
    return new HtmlDownloader({
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
    url,
  }): Promise<void> => {
    const { data } = await axios.get(url);

    await this.fileWriter.writeToFile({
      contents: data,
      destinationFilepath,
    });
  };
}
