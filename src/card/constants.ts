import { CorePath } from "../core/path/constants";

export namespace CardUrl {
  const base = "https://pocket.limitlesstcg.com";

  export const BOOSTER_PACK_SETS = `${base}/cards`;
}

export namespace CardPath {
  const base = `${CorePath.RESOURCES}/card-html`;

  export const BOOSTER_PACK_SETS = `${base}/booster-pack-sets.html`;
}
