import { access } from "fs/promises";

import type { Nullable } from "../../types/constants";
import type { IFileChecker } from "../interfaces/file-checker";

export class FileChecker implements IFileChecker {
  private static instance: Nullable<FileChecker> = null;

  private constructor() {}

  public static readonly getInstance = (): FileChecker => {
    if (FileChecker.instance === null) {
      FileChecker.instance = new FileChecker();
    }

    return FileChecker.instance;
  }

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
}
