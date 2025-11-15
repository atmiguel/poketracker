import * as z from 'zod';
import { BoardState } from './board-state';
import { PlayerMove } from './player-move';

export const GameState = z.object({
  initialBoardState: BoardState,
  playerMoves: z.array(PlayerMove),
});
export type GameState = z.infer<typeof GameState>;
