import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health';
import authRouter from './routes/auth';
import { startServer } from './utils/server';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/health', healthRoutes);
app.use('/api/v1/auth', authRouter);


const PORT = parseInt(process.env.PORT || '3000', 10);

startServer(app, PORT);
