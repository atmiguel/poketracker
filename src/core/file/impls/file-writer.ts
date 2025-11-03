import { writeFile, mkdir } from "fs/promises";
import { dirname } from "path";

import type { IFileWriter } from '../interfaces/file-writer';
import type { Nullable } from "../../types/constants";


export class FileWriter implements IFileWriter {
  private static instance: Nullable<FileWriter> = null;

  private constructor() {}

  public static readonly getInstance = (): FileWriter => {
    if (FileWriter.instance === null) {
      FileWriter.instance = new FileWriter();
    }

    return FileWriter.instance;
  }

  public readonly writeToFile: IFileWriter['writeToFile'] = async ({
    contents,
    destinationFilepath,
  }): Promise<void> => {
    await mkdir(dirname(destinationFilepath), { recursive: true });
    await writeFile(destinationFilepath, contents);
  };
}
