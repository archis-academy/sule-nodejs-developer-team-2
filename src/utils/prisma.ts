import prisma from '../config/db';

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL connection successful via Prisma!');
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await prisma.$disconnect();
  console.log('🔌 PostgreSQL connection disconnected.');
};

connectDB();

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: Disconnecting from PostgreSQL');
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: Disconnecting from PostgreSQL');
  await disconnectDB();
  process.exit(0);
});
