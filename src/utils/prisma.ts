import prisma from '../config/db';

export async function connectPrisma() {
  await prisma.$connect();
  console.log('Prisma connected.');
}

export async function disconnectPrisma() {
  await prisma.$disconnect();
  console.log('Prisma disconnected.');
}
