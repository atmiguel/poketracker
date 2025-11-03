export interface IConsolePrinter {
  print: (
    contents: string,
    options?: {
      withNewline?: boolean;
    },
  ) => void;
}
