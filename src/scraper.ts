import axios from "axios";
import * as cheerio from "cheerio";

export async function scrape(url: string): Promise<string> {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    return $("title").text().trim(); // Get page title
  } catch (error) {
    console.error("Scraping failed:", error);
    return "";
  }
}
