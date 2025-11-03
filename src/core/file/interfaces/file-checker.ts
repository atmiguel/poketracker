import type { Path } from "../../types/path";

export interface IFileChecker {
  checkFileExists: (params: { path: Path }) => Promise<{ fileExists: boolean }>;
}
