import { z } from 'zod';

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters long'),
  email: z
    .email()
    .min(1, 'Email is required')
    .max(50, 'Email must be less than 50 characters long'),
  password: z
    .string('password should be a string')
    .min(8, 'Password must be at least 8 characters long')
    .max(16, 'Password must be at most 16 characters long'),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
