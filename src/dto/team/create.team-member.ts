import { z } from 'zod';

export const createTeamMemberSchema = z.object({
  userId: z.uuid(),
});

export type CreateTeamMemberDto = z.infer<typeof createTeamMemberSchema>;
