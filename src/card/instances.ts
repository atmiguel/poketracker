import { CoreInstances } from '../core/instances';
import { BoosterPackParser } from './impls/booster-pack-parser';
import { BoosterPackRetriever } from './impls/booster-pack-retriever';
import { BoosterPackSetParser } from './impls/booster-pack-set-parser';
import { BoosterPackSetRetriever } from './impls/booster-pack-set-retriever';
import { CardParser } from './impls/card-parser';
import { CardRetriever } from './impls/card-retriever';

export namespace CardInstances {
  const { fileManager, htmlDownloader } = CoreInstances;

  export const cardParser = new CardParser();
  export const boosterPackParser = new BoosterPackParser();
  export const boosterPackSetParser = new BoosterPackSetParser();

  export const cardRetriever = new CardRetriever({
    cardParser,
    fileReader: fileManager,
    htmlDownloader,
  });

  export const boosterPackRetriever = new BoosterPackRetriever({
    boosterPackParser,
    cardRetriever,
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
