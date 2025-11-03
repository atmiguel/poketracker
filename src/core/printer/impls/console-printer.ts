import type { Nullable } from '../../types/constants';
import type { IConsolePrinter } from '../interfaces/console-printer';

// TODO: add a global environment variable that can turn this off
export class ConsolePrinter implements IConsolePrinter {
  private static instance: Nullable<ConsolePrinter> = null;

  private constructor() {}

  public static readonly getInstance = (): ConsolePrinter => {
    if (ConsolePrinter.instance === null) {
      ConsolePrinter.instance = new ConsolePrinter();
    }

    return ConsolePrinter.instance;
  }


  public readonly print: IConsolePrinter['print'] = (
    contents,
    options,
  ): void => {
    const { withNewline = true } = options ?? {};

    process.stdout.write(contents);
    if (withNewline) {
      process.stdout.write('\n');
    }
  };
}
