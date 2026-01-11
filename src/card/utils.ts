import { Path } from "../core/path/types";
import { CardConstants } from "./constants";

export namespace CardUtils {
  export const getBoosterPackSetUrl = ({packSetId}: {packSetId: string}): string => {
    return `${CardConstants.BOOSTER_PACK_SETS_URL}/${packSetId}`;
  };

  export const getBoosterPackSetPath = ({packSetId}: {packSetId: string}): Path => {
    return Path.create(`${CardConstants.BASE_PATH}/booster-pack-set/${packSetId}.html`);
  };
}
