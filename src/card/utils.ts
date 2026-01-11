import { Path } from "../core/path/types";
import { CCard } from "./constants";

export namespace UCard {
  export const getBoosterPackSetUrl = ({packSetId}: {packSetId: string}): string => {
    return `${CCard.BOOSTER_PACK_SETS_URL}/${packSetId}`;
  };

  export const getBoosterPackSetPath = ({packSetId}: {packSetId: string}): Path => {
    return Path.create(`${CCard.BASE_PATH}/booster-pack-set/${packSetId}.html`);
  };
}
