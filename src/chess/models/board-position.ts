import * as z from 'zod';
import { NonNegativeInteger } from '../../core/types/zod';

export const BoardPosition = z.object({
  columnIndex: NonNegativeInteger.lt(8),
  rowIndex: NonNegativeInteger.lt(8),
});
export type BoardPosition = z.infer<typeof BoardPosition>;
