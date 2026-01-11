import { access, mkdir, readFile, writeFile } from 'fs/promises';

import type { IFileChecker } from '../interfaces/file-checker';
import type { IFileWriter } from '../interfaces/file-writer';
import { dirname } from 'path';
import type { IFileReader } from '../interfaces/file-reader';
import { CoreUtils } from '../../utils';

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
    mode,
    path,
  }): Promise<void> => {
    switch (mode) {
      case 'DoNotOverwrite': {
        const { fileExists } = await this.checkFileExists({ path });

        if (fileExists) {
          process.stdout.write(`File already exists at ${path}, not overwriting.\n`);

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

    process.stdout.write(`Writing to ${path}...`);

    await mkdir(dirname(path.toString()), { recursive: true });
    await writeFile(path.toString(), contents);

    process.stdout.write('done\n');
  };
}
