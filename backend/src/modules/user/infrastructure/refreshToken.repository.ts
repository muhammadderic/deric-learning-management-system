import { PrismaClient, RefreshToken } from "@prisma/client";

export interface IRefreshTokenRepository {
  create(userId: string, token: string, expiresAt: Date): Promise<RefreshToken>;
  delete(token: string): Promise<RefreshToken>;
}

export function createRefreshTokenRepository(prisma: PrismaClient): IRefreshTokenRepository {
  return {
    async create(userId: string, token: string, expiresAt: Date) {
      return prisma.refreshToken.create({
        data: { userId, token, expiresAt },
      });
    },

    async delete(token: string) {
      return prisma.refreshToken.delete({
        where: { token },
      });
    },
  };
}

