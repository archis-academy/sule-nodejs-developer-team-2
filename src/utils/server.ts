import type { Application } from 'express';
import { connectPrisma, disconnectPrisma } from './prisma';

export async function startServer(app: Application, port: number) {
  try {
    await connectPrisma();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT signal received: closing HTTP server');
      await disconnectPrisma();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('SIGTERM signal received: closing HTTP server');
      await disconnectPrisma();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to connect to Prisma or start server:', error);
    process.exit(1);
  }
}
