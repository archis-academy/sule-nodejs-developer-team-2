import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health';
import authRouter from './routes/auth';
import { startServer } from './utils/server';
import { validateEnvVariables } from './utils/validateEnv';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/health', healthRoutes);
app.use('/api/v1/auth', authRouter);

try {
  validateEnvVariables();
} catch (error: unknown) {
  console.error('Error validating environment variables:', error);
  process.exit(1);
}

const PORT = parseInt(process.env.PORT || '3000', 10);

startServer(app, PORT);
