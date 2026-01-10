import { parse, resolve, type ParsedPath } from 'path';

export class Path {
  private readonly parsedPath: ParsedPath;
  private readonly value: string;

  private constructor(params: { parsedPath: ParsedPath; value: string }) {
    this.parsedPath = params.parsedPath;
    this.value = params.value;
  }

  public static readonly create = (value: string): Path => {
    const resolvedValue = resolve(value);
    const parsedPath = parse(resolvedValue);

    return new Path({ parsedPath, value: resolvedValue });
  };

  public readonly isRoot = (): boolean => {
    return this.value === '/';
  };

  public get parent(): Path {
    return Path.create(this.parsedPath.dir);
  }

  public get filename(): string {
    return this.parsedPath.base;
  }

  public readonly toString = (): string => {
    return this.value;
  };
}
