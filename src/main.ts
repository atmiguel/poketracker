import { HtmlDownloader } from "./html/impls/html-downloader";

const main = async (): Promise<void> => {
  const downloader = new HtmlDownloader();

  await downloader.downloadHtml({
    destinationFilepath: 'resources/temp.html',
    url: 'https://pocket.limitlesstcg.com/cards',
  });
};

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
