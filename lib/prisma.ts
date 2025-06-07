// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // `global` にキャッシュしてホットリロードでも複数生成を防止
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ['query'],            // 好みで削除
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
