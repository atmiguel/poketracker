import type { Nullable } from '../../types';
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

  public readonly info: ILogger['info'] = (contents): void => {
    process.stdout.write(contents);
  };
}

export const LOGGER = Logger.getInstance();
