import { FileManager } from "../core/file/impls/file-manager";
import { HtmlDownloader } from "../core/html/impls/html-downloader";

export namespace CoreInstances {
  export const fileManager = new FileManager();

  export const htmlDownloader = new HtmlDownloader({
    fileWriter: fileManager,
  });
}
