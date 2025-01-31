import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const userRepository = {
  async createUser(
    email: string, 
    passwordHash: string, 
    role: string = "student"
  ) {
    return prisma.user.create({
      data: { email, passwordHash, role },
    });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
};
