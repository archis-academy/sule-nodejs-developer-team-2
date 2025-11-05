import { z } from 'zod';
import { createUserSchema } from '../user/create.user';

export const registerAuthSchema = createUserSchema;

export type RegisterAuthDto = z.infer<typeof registerAuthSchema>;
