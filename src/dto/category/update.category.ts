import { z } from 'zod';

export const UpdateCategorySchema = z.object({
  name: z.string(),
});

export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;
