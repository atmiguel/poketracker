import { CardPath, CardUrl } from "./card/constants";
import { HtmlDownloader } from "./core/html/impls/html-downloader";

const main = async (): Promise<void> => {
  await HtmlDownloader.getInstance().downloadHtml({
    destinationFilepath: CardPath.BOOSTER_PACK_SETS,
    url: CardUrl.BOOSTER_PACK_SETS,
  });
};

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
