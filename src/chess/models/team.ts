import * as z from 'zod';

export const Team = z.enum(['black', 'white']);
export type Team = z.infer<typeof Team>;
export const TEAMS = Team.enum;
