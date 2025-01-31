import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const refreshTokenRepository = {
  async create(
    userId: string, 
    token: string, 
    expiresAt: Date
  ) {
    return prisma.refreshToken.create({
      data: { userId, token, expiresAt },
    });
  },

  async delete(token: string) {
    return prisma.refreshToken.delete({ where: { token } });
  },
};
