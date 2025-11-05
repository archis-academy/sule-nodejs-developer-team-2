import { z } from 'zod';
import { registerAuthSchema } from './register.auth';

export const loginAuthSchema = registerAuthSchema.omit({
  name: true,
});

export type LoginAuthDto = z.infer<typeof loginAuthSchema>;
