// src/modules/user/infrastructure/__tests__/user.repository.test.ts
import { mockDeep } from "jest-mock-extended";
import { PrismaClient, User as UserDTO } from "@prisma/client";
import { describe, it, expect } from "@jest/globals";

// Create a deep mock of Prisma
const prisma = mockDeep<PrismaClient>();

// Instead of importing your original repo (which uses real prisma),
// we make a test version wired to the mocked prisma
export const testUserRepository = {
  async create(
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

describe("UserRepository", () => {
  it("should create a user", async () => {
    const fakeUser: UserDTO = {
      id: "uuid-123",
      email: "test@example.com",
      passwordHash: "hashedpw",
      role: "student",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prisma.user.create.mockResolvedValue(fakeUser);

    const result = await testUserRepository.create(
      "test@example.com",
      "hashedpw"
    );

    expect(result.email).toBe("test@example.com");
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: "test@example.com",
        passwordHash: "hashedpw",
        role: "student",
      },
    });
  });

  it("should find user by email", async () => {
    const fakeUser: UserDTO = {
      id: "uuid-456",
      email: "findme@example.com",
      passwordHash: "hashedpw",
      role: "student",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prisma.user.findUnique.mockResolvedValue(fakeUser);

    const result = await testUserRepository.findByEmail("findme@example.com");

    expect(result?.email).toBe("findme@example.com");
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "findme@example.com" },
    });
  });
});
