import { z } from 'zod';
import { createTeamSchema } from './create.team';

export const updateTeamSchema = createTeamSchema
  .partial()
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: 'At least one field (name or description) must be provided',
  });

export type UpdateTeamDto = z.infer<typeof updateTeamSchema>;
