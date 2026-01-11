import { access, mkdir, readFile, writeFile } from 'fs/promises';

import type { IFileChecker } from '../interfaces/file-checker';
import type { IFileWriter } from '../interfaces/file-writer';
import { dirname } from 'path';
import type { IFileReader } from '../interfaces/file-reader';

export class FileManager implements IFileChecker, IFileReader, IFileWriter {
  public constructor() {}

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

  public readonly readFromFile: IFileReader['readFromFile'] = async ({
    path,
  }): Promise<{ contents: string }> => {
    const contents = await readFile(path.toString(), 'utf-8');
    return { contents };
  };

  public readonly writeToFile: IFileWriter['writeToFile'] = async ({
    contents,
    path,
  }): Promise<void> => {
    console.log(`Writing to ${path}...`);
    await mkdir(dirname(path.toString()), { recursive: true });
    await writeFile(path.toString(), contents);
  };
}
