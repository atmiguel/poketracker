import type { IHtmlAccessor } from '../../core/html/interfaces/html-downloader';
import { FILE_WRITE_MODES } from '../../core/html/types';
import type { IFileReader } from '../../core/file/interfaces/file-reader';
import { CardUtils } from '../utils';
import { CARD_RARITY_SYMBOLS, type Card } from '../types';
import type { ICardRetriever } from '../interfaces/card-retriever';
import type { ICardParser } from '../interfaces/card-parser';
import { CoreUtils } from '../../core/utils';

export class CardRetriever implements ICardRetriever {
  private readonly cardParser: ICardParser;
  private readonly fileReader: IFileReader;
  private readonly htmlDownloader: IHtmlAccessor;

  public constructor(params: {
    cardParser: ICardParser;
    fileReader: IFileReader;
    htmlDownloader: IHtmlAccessor;
  }) {
    this.cardParser = params.cardParser;
    this.fileReader = params.fileReader;
    this.htmlDownloader = params.htmlDownloader;
  }

  public readonly retrieveCard: ICardRetriever['retrieveCard'] = async ({
    canBeShiny,
    cardNumber,
    packSetId,
  }) => {
    const path = CardUtils.getCardPath({ cardNumber, packSetId });

    await this.htmlDownloader.downloadHtmlToFile({
      mode: FILE_WRITE_MODES.DoNotOverwrite,
      path,
      url: CardUtils.getCardUrl({ cardNumber, packSetId }),
    });
    const { contents } = await this.fileReader.readFromFile({
      path,
    });

    const { parsedCard } = this.cardParser.parseCard({
      canBeShiny,
      data: contents,
    });
    return { parsedCard };
  };

  public readonly retrieveCards: ICardRetriever['retrieveCards'] = async ({
    cardCount,
    packName,
    packSetId,
  }) => {
    const cards: Array<Card> = [];
    let seenThreeStars = false;
    for (const cardNumber of CoreUtils.range(cardCount).map((o) => o + 1)) {
      const { parsedCard } = await this.retrieveCard({
        canBeShiny: seenThreeStars,
        cardNumber,
        packSetId,
      });

      if (parsedCard.rarity.count === 3 && parsedCard.rarity.symbol === CARD_RARITY_SYMBOLS.Star) {
        seenThreeStars = true;
      }

      if (packName === null || parsedCard.packName === null || parsedCard.packName === packName) {
        const { name, rarity } = parsedCard;

        cards.push({
          name,
          number: cardNumber,
          rarity,
        });
      }
    }

    return { cards };
  };
}
