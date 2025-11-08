import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name cannot be empty')
    .max(50, 'Category name must be less than 50 characters.'),
});

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
