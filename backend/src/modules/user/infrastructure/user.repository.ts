import { PrismaClient } from "@prisma/client";

export interface IUserRepository {
  findByEmail(email: string): Promise<any>;
  create(email: string, passwordHash: string): Promise<any>;
}

export const createUserRepository = (prisma: PrismaClient): IUserRepository => ({
  async create(email: string, passwordHash: string, role: string = "student") {
    return prisma.user.create({
      data: { email, passwordHash, role },
    });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },
});
