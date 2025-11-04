import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import prisma from './config/db';
import healthRoutes from './routes/health';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/health', healthRoutes);

async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL connection successful via Prisma!');
    
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err);
    process.exit(1);
  }
}

startServer();
