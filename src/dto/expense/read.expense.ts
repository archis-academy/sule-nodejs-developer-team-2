import { z } from 'zod';

export const ReadExpenseQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, 'Page must be greater than 0'),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100'),
  category: z.uuid('Category ID must be a valid UUID.').optional(),
  member: z.uuid('Member ID must be a valid UUID.').optional(),
  startDate: z
    .string()
    .datetime('Start date must be a valid ISO date string.')
    .optional(),
  endDate: z
    .string()
    .datetime('End date must be a valid ISO date string.')
    .optional(),
});

export type ReadExpenseQueryDto = z.infer<typeof ReadExpenseQuerySchema>;
