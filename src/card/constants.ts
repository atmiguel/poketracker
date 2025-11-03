import { CorePath } from '../core/path/constants';
import { Path } from '../core/types/path';

export namespace CardUrl {
  const base = 'https://pocket.limitlesstcg.com';

  export const BOOSTER_PACK_SETS = `${base}/cards`;
}

export namespace CardPath {
  const base = Path.create(`${CorePath.RESOURCES}/card-html`);

  export const BOOSTER_PACK_SETS = Path.create(`${base}/booster-pack-sets.html`);
}
