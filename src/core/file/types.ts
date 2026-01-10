import z from 'zod';

export const FileWriteMode = z.enum(['DoNotOverwrite', 'OverwriteIfExists']);
export type FileWriteMode = z.infer<typeof FileWriteMode>;
export const FILE_WRITE_MODES = FileWriteMode.enum;
