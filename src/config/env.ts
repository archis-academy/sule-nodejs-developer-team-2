import dotenv from 'dotenv';
import { cleanEnv, str, num } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  JWT_ACCESS: str(),
  JWT_REFRESH: str(),
  REFRESH_EXPIRE_IN: num({ default: 7 }),
  ACCESS_EXPIRE_IN: str({ default: '1h' }),
});
