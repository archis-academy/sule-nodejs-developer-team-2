import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(3, 'Team name must be at least 3 characters long')
    .max(50, 'Team name must be less than 50 characters long'),
  description: z
    .string()
    .max(200, 'Description must be less than 200 characters long')
    .optional(),
});

export type CreateTeamDto = z.infer<typeof createTeamSchema>;
