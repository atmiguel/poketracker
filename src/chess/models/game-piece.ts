import * as z from 'zod';
import { Team } from './team';
import { MeleeCharacter } from './melee-character';

export const GamePieceType = z.enum([
  'bishop',
  'king',
  'knight',
  'pawn',
  'queen',
  'rook',
]);
export type GamePieceType = z.infer<typeof GamePieceType>;
export const GAME_PIECE_TYPES = GamePieceType.enum;

export const GamePiece = z.object({
  character: MeleeCharacter,
  team: Team,
  type: GamePieceType,
});
export type GamePiece = z.infer<typeof GamePiece>;
