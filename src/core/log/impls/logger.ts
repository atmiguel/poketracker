import type { Nullable } from '../../types/builtin';
import type { ILogger } from '../interfaces/logger';

class Logger implements ILogger {
  private static instance: Nullable<Logger> = null;

  private constructor() {}

  public static readonly getInstance = (): Logger => {
    if (Logger.instance === null) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  };

  public readonly info: ILogger['info'] = (contents, options): void => {
    const { withoutNewline = false } = options ?? {};

    process.stdout.write(contents);
    if (!withoutNewline) {
      process.stdout.write('\n');
    }
  };
}

export const LOGGER = Logger.getInstance();
