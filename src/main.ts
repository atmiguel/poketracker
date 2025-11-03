import { CCard } from './card/constants';
import { HtmlDownloader } from './core/html/impls/html-downloader';

const main = async (): Promise<void> => {
  await HtmlDownloader.getInstance().downloadHtml({
    destinationPath: CCard.Path.BOOSTER_PACK_SETS,
    url: CCard.Url.BOOSTER_PACK_SETS,
    options: {
      shouldOverwrite: true,
    },
  });
};

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
