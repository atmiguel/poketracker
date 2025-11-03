import { access, mkdir, readFile, writeFile } from 'fs/promises';

import type { Nullable } from '../../types/builtin';
import type { IFileChecker } from '../interfaces/file-checker';
import type { IFileWriter } from '../interfaces/file-writer';
import { LOGGER } from '../../log/impls/logger';
import { dirname } from 'path';
import type { IFileReader } from '../interfaces/file-reader';

export class FileManager implements IFileChecker, IFileWriter, IFileReader {
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
    path,
    options,
  }): Promise<void> => {
    const { shouldOverwrite = false } = options ?? {};

    if (shouldOverwrite) {
      // No need to check file existence
    } else {
      const { fileExists } = await this.checkFileExists({ path });

      if (fileExists) {
        LOGGER.info(`File already exists at ${path}, not overwriting.`);
        return;
      } else {
        // Doesn't exist so we'll write to it
      }
    }

    LOGGER.info(`Writing to ${path}...`, { withoutNewline: true });
    await mkdir(dirname(path.toString()), { recursive: true });
    await writeFile(path.toString(), contents);
    LOGGER.info('done');
  };

  public readonly readFromFile: IFileReader['readFromFile'] = async ({
    path,
  }): Promise<{ contents: string }> => {
    const contents = await readFile(path.toString(), 'utf-8');
    return { contents };
  };
}
