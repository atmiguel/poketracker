import * as z from 'zod';

export const MeleeCharacter = z.enum([
  'bowser',
  'captainFalcon',
  'donkeyKong',
  'drMario',
  'falco',
  'fox',
  'ganondorf',
  'iceClimbers',
  'jigglypuff',
  'kirby',
  'link',
  'luigi',
  'mario',
  'marth',
  'mewtwo',
  'mrGameAndWatch',
  'ness',
  'peach',
  'pichu',
  'pikachu',
  'roy',
  'samus',
  'sheik',
  'yoshi',
  'youngLink',
  'zelda',
]);
export type MeleeCharacter = z.infer<typeof MeleeCharacter>;
export const MELEE_CHARACTERS = MeleeCharacter.enum;
