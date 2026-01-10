import { CCard } from '../card/constants';
import { BoosterPackSetParser } from '../card/impls/booster-pack-set-parser';
import { FileManager } from '../core/file/impls/file-manager';
import { FILE_WRITE_MODES } from '../core/file/types';
import { HtmlDownloader } from '../core/html/impls/html-downloader';

const main = async (): Promise<void> => {
  await HtmlDownloader.getInstance().downloadHtmlToFile({
    mode: FILE_WRITE_MODES.DoNotOverwrite,
    path: CCard.BOOSTER_PACK_SETS_PATH,
    url: CCard.BOOSTER_PACK_SETS_URL,
  });

  const { contents } = await FileManager.getInstance().readFromFile({
    path: CCard.BOOSTER_PACK_SETS_PATH,
  });
  const result = BoosterPackSetParser.getInstance().parseBoosterPackSets({ data: contents });

  console.log(result);
};

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
