export interface ILogger {
  info: (
    contents: string,
    options?: {
      withoutNewline?: boolean;
    },
  ) => void;
}
