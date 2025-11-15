import * as z from 'zod';
import { GamePiece } from './game-piece';

export const BoardState = z.object({
  gamePieces: z.array(z.array(z.nullable(GamePiece)).length(8)).length(8),
});
export type BoardState = z.infer<typeof BoardState>;
