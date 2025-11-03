export interface IFileChecker {
  checkFileExists: (params: { filepath: string }) => Promise<{ fileExists: boolean }>;
}
