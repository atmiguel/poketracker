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
    path,
  }): Promise<{ fileExists: boolean }> => {
    let fileExists: boolean;
    try {
      await access(path.toString());
      fileExists = true;
    } catch {
      fileExists = false;
    }

    return { fileExists };
  };

  public readonly writeToFile: IFileWriter['writeToFile'] = async ({
    contents,
    destinationPath,
    options,
  }): Promise<void> => {
    const { shouldOverwrite = false } = options ?? {};

    if (shouldOverwrite) {
      // No need to check file existence
    } else {
      const { fileExists } = await this.checkFileExists({ path: destinationPath });

      if (fileExists) {
        LOGGER.info(`File already exists at ${destinationPath}, not overwriting.`);
        return;
      } else {
        // Doesn't exist so we'll write to it
      }
    }

    LOGGER.info(`Writing to ${destinationPath}...`, { withoutNewline: true });
    await mkdir(dirname(destinationPath.toString()), { recursive: true });
    await writeFile(destinationPath.toString(), contents);
    LOGGER.info('done');
  };
}
