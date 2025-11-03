import { writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';

import type { IFileWriter } from '../interfaces/file-writer';
import type { Nullable } from '../../types/constants';
import type { IFileChecker } from '../interfaces/file-checker';
import { FileChecker } from './file-checker';

export class FileWriter implements IFileWriter {
  private static instance: Nullable<FileWriter> = null;

  private readonly fileChecker: IFileChecker;

  private constructor(params: { fileChecker: IFileChecker }) {
    this.fileChecker = params.fileChecker;
  }

  private static readonly createInstance = (): FileWriter => {
    return new FileWriter({
      fileChecker: FileChecker.getInstance(),
    });
  };

  public static readonly getInstance = (): FileWriter => {
    if (FileWriter.instance === null) {
      FileWriter.instance = FileWriter.createInstance();
    }

    return FileWriter.instance;
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
      const { fileExists } = await this.fileChecker.checkFileExists({
        filepath: destinationFilepath,
      });

      if (fileExists) {
        console.info(`File already exists at ${destinationFilepath}, not overwriting.`);
        return;
      } else {
        // Doesn't exist so we'll write to it
      }
    }

    console.info(`Writing to ${destinationFilepath}...`);
    await mkdir(dirname(destinationFilepath), { recursive: true });
    await writeFile(destinationFilepath, contents);
    console.info('done');
  };
}
