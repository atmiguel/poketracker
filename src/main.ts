import { CCard } from './card/constants';
import { BoosterPackSetParser } from './card/impls/booster-pack-set-parser';
import { FileManager } from './core/file/impls/file-manager';
import { HtmlDownloader } from './core/html/impls/html-downloader';

const main = async (): Promise<void> => {
  await HtmlDownloader.getInstance().downloadHtml({
    path: CCard.Path.BOOSTER_PACK_SETS,
    url: CCard.Url.BOOSTER_PACK_SETS,
    options: {
      shouldOverwrite: true,
    },
  });

  const { contents } = await FileManager.getInstance().readFromFile({
    path: CCard.Path.BOOSTER_PACK_SETS,
  });
  const result = BoosterPackSetParser.getInstance().parseBoosterPackSets({ data: contents });

  console.log(result);
};

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
