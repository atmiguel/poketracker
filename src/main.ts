import { scrape } from "./scraper"; // Note the .js extension for Node ESM

const url = "https://example.com";

async function main() {
  const title = await scrape(url);
  console.log("Page title:", title);
}

main();
