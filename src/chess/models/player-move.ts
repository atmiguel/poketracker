import * as z from 'zod';
import { GamePiece } from './game-piece';
import { BoardPosition } from './board-position';

export const PlayerMove = z.object({
  endPosition: BoardPosition,
  movedPiece: GamePiece,
  startPosition: BoardPosition,
  takenPiece: z.nullable(GamePiece),
});
export type PlayerMove = z.infer<typeof PlayerMove>;
