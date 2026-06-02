import { PrismaClient } from '@prisma/client';

/**
 * Singleton pattern untuk Prisma Client.
 * Mencegah pembuatan multiple instance saat hot-reload di development.
 */
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
