import { writeFile, mkdir } from "fs/promises";
import { dirname } from "path";

import type { IFileWriter } from '../interfaces/file-writer';
import type { Nullable } from "../../types/constants";
import type { IFileChecker } from "../interfaces/file-checker";
import { FileChecker } from "./file-checker";
import type { IConsolePrinter } from "../../printer/interfaces/console-printer";
import { ConsolePrinter } from "../../printer/impls/console-printer";

export class FileWriter implements IFileWriter {
  private static instance: Nullable<FileWriter> = null;

  private readonly consolePrinter: IConsolePrinter;
  private readonly fileChecker: IFileChecker;

  private constructor(params: {
    consolePrinter: IConsolePrinter;
    fileChecker: IFileChecker;
  }) {
    this.consolePrinter = params.consolePrinter;
    this.fileChecker = params.fileChecker;
  }

  private static readonly createInstance = (): FileWriter => {
    return new FileWriter({
      consolePrinter: ConsolePrinter.getInstance(),
      fileChecker: FileChecker.getInstance(),
    });
  }

  public static readonly getInstance = (): FileWriter => {
    if (FileWriter.instance === null) {
      FileWriter.instance = FileWriter.createInstance();
    }

    return FileWriter.instance;
  }

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
        this.consolePrinter.print(`File already exists at ${destinationFilepath}, not overwriting.`);
        return;
      } else {
        // Doesn't exist so we'll write to it
      }
    }

    this.consolePrinter.print(`Writing to ${destinationFilepath}...`, {withNewline: false});
    await mkdir(dirname(destinationFilepath), { recursive: true });
    await writeFile(destinationFilepath, contents);
    this.consolePrinter.print('done');
  };
}
