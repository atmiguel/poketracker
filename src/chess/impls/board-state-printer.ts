import { BoardState } from "../models/board-state";
import { Table } from 'console-table-printer';
import { GAME_PIECE_TYPES, GamePiece } from "../models/game-piece";
import { MELEE_CHARACTERS } from "../models/melee-character";
import { TEAMS } from "../models/team";

const COLUMN_IDS = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
];

const printBoardState = ({ boardState }: { boardState: BoardState }): void => {
  const table = new Table(['', ...COLUMN_IDS]);

  boardState.gamePieces.forEach((gamePieceRow, rowIndex) => {
    const tableRow: Record<string, string | number> = {'': 8 - rowIndex};

    gamePieceRow.forEach((gamePiece, columnIndex) => {
      const columnId = COLUMN_IDS[columnIndex]!;

      tableRow[columnId] = gamePiece === null ? '' : `${gamePiece.team[0]} ${gamePiece.type}`;
    });

    table.addRow(tableRow, {separator: true});
  });

  table.printTable();
};

const boardState: BoardState = BoardState.parse({
  gamePieces: [
    [
      GamePiece.parse({
        character: MELEE_CHARACTERS.bowser,
        team: TEAMS.white,
        type: GAME_PIECE_TYPES.rook,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.falco,
        team: TEAMS.white,
        type: GAME_PIECE_TYPES.knight,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.fox,
        team: TEAMS.white,
        type: GAME_PIECE_TYPES.bishop,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.captainFalcon,
        team: TEAMS.white,
        type: GAME_PIECE_TYPES.king,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.pichu,
        team: TEAMS.white,
        type: GAME_PIECE_TYPES.queen,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.jigglypuff,
        team: TEAMS.white,
        type: GAME_PIECE_TYPES.bishop,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.mario,
        team: TEAMS.white,
        type: GAME_PIECE_TYPES.knight,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.marth,
        team: TEAMS.white,
        type: GAME_PIECE_TYPES.rook,
      } as GamePiece),
    ],
    [
      GamePiece.parse({
        character: MELEE_CHARACTERS.bowser,
        team: TEAMS.white,
        type: GAME_PIECE_TYPES.pawn,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.falco,
        team: TEAMS.white,
        type: GAME_PIECE_TYPES.pawn,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.fox,
        team: TEAMS.white,
        type: GAME_PIECE_TYPES.pawn,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.captainFalcon,
        team: TEAMS.white,
        type: GAME_PIECE_TYPES.pawn,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.pichu,
        team: TEAMS.white,
        type: GAME_PIECE_TYPES.pawn,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.jigglypuff,
        team: TEAMS.white,
        type: GAME_PIECE_TYPES.pawn,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.mario,
        team: TEAMS.white,
        type: GAME_PIECE_TYPES.pawn,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.marth,
        team: TEAMS.white,
        type: GAME_PIECE_TYPES.pawn,
      } as GamePiece),
    ],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [
      GamePiece.parse({
        character: MELEE_CHARACTERS.bowser,
        team: TEAMS.black,
        type: GAME_PIECE_TYPES.pawn,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.falco,
        team: TEAMS.black,
        type: GAME_PIECE_TYPES.pawn,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.fox,
        team: TEAMS.black,
        type: GAME_PIECE_TYPES.pawn,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.captainFalcon,
        team: TEAMS.black,
        type: GAME_PIECE_TYPES.pawn,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.pichu,
        team: TEAMS.black,
        type: GAME_PIECE_TYPES.pawn,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.jigglypuff,
        team: TEAMS.black,
        type: GAME_PIECE_TYPES.pawn,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.mario,
        team: TEAMS.black,
        type: GAME_PIECE_TYPES.pawn,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.marth,
        team: TEAMS.black,
        type: GAME_PIECE_TYPES.pawn,
      } as GamePiece),
    ],
    [
      GamePiece.parse({
        character: MELEE_CHARACTERS.bowser,
        team: TEAMS.black,
        type: GAME_PIECE_TYPES.rook,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.falco,
        team: TEAMS.black,
        type: GAME_PIECE_TYPES.knight,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.fox,
        team: TEAMS.black,
        type: GAME_PIECE_TYPES.bishop,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.captainFalcon,
        team: TEAMS.black,
        type: GAME_PIECE_TYPES.king,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.pichu,
        team: TEAMS.black,
        type: GAME_PIECE_TYPES.queen,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.jigglypuff,
        team: TEAMS.black,
        type: GAME_PIECE_TYPES.bishop,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.mario,
        team: TEAMS.black,
        type: GAME_PIECE_TYPES.knight,
      } as GamePiece),
      GamePiece.parse({
        character: MELEE_CHARACTERS.marth,
        team: TEAMS.black,
        type: GAME_PIECE_TYPES.rook,
      } as GamePiece),
    ],
  ],
} as BoardState);
printBoardState({ boardState });