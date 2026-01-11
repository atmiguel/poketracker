import axios from 'axios';

import type { IHtmlAccessor } from '../interfaces/html-downloader';
import type { IFileWriter } from '../../file/interfaces/file-writer';
import type { IFileChecker } from '../../file/interfaces/file-checker';
import { CoreUtils } from '../../utils';

export class HtmlDownloader implements IHtmlAccessor {
  private readonly fileChecker: IFileChecker;
  private readonly fileWriter: IFileWriter;

  public constructor(params: { fileChecker: IFileChecker; fileWriter: IFileWriter }) {
    this.fileChecker = params.fileChecker;
    this.fileWriter = params.fileWriter;
  }

  public readonly downloadHtmlToFile: IHtmlAccessor['downloadHtmlToFile'] = async ({
    mode,
    path,
    url,
  }): Promise<void> => {
    switch (mode) {
      case 'DoNotOverwrite': {
        const { fileExists } = await this.fileChecker.checkFileExists({ path });

        if (fileExists) {
          // console.log(`File already exists at ${path}, not overwriting.`);
          return;
        } else {
          // Doesn't exist so we'll write to it
        }

        break;
      }
      case 'OverwriteIfExists': {
        // No need to check file existence
        break;
      }
      default: {
        CoreUtils.assertNever(mode);
      }
    }

    const { data } = await axios.get(url);

    await this.fileWriter.writeToFile({
      contents: data,
      path,
    });
  };
}
