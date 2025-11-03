import { access, mkdir, writeFile } from 'fs/promises';

import type { Nullable } from '../../types/constants';
import type { IFileChecker } from '../interfaces/file-checker';
import type { IFileWriter } from '../interfaces/file-writer';
import { LOGGER } from '../../log/impls/logger';
import { dirname } from 'path';

export class FileManager implements IFileChecker, IFileWriter {
  private static instance: Nullable<FileManager> = null;

  private constructor() {}

  public static readonly getInstance = (): FileManager => {
    if (FileManager.instance === null) {
      FileManager.instance = new FileManager();
    }

    return FileManager.instance;
  };

  public readonly checkFileExists: IFileChecker['checkFileExists'] = async ({
    filepath,
  }): Promise<{ fileExists: boolean }> => {
    let fileExists: boolean;
    try {
      await access(filepath);
      fileExists = true;
    } catch {
      fileExists = false;
    }

    return { fileExists };
  };

  public readonly writeToFile: IFileWriter['writeToFile'] = async ({
    contents,
    destinationFilepath,
    options,
  }): Promise<void> => {
    const { shouldOverwrite = false } = options ?? {};

    if (shouldOverwrite) {
      // No need to check file existence
    } else {
      const { fileExists } = await this.checkFileExists({ filepath: destinationFilepath });

      if (fileExists) {
        LOGGER.info(`File already exists at ${destinationFilepath}, not overwriting.`);
        return;
      } else {
        // Doesn't exist so we'll write to it
      }
    }

    LOGGER.info(`Writing to ${destinationFilepath}...`, { withoutNewline: true });
    await mkdir(dirname(destinationFilepath), { recursive: true });
    await writeFile(destinationFilepath, contents);
    LOGGER.info('done');
  };
}
