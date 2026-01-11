import { CoreInstances } from "../core/instances";
import { BoosterPackRetriever } from "./impls/booster-pack-retriever";
import { BoosterPackSetParser } from "./impls/booster-pack-set-parser";
import { BoosterPackSetRetriever } from "./impls/booster-pack-set-retriever";

export namespace CardInstances {
  const { fileManager, htmlDownloader } = CoreInstances;

  export const boosterPackSetParser = new BoosterPackSetParser();

  export const boosterPackRetriever = new BoosterPackRetriever({
    fileReader: fileManager,
    htmlDownloader,
  });

  export const boosterPackSetRetriever: BoosterPackSetRetriever = new BoosterPackSetRetriever({
    boosterPackSetParser,
    boosterPackRetriever,
    fileReader: fileManager,
    htmlDownloader,
  });
}
