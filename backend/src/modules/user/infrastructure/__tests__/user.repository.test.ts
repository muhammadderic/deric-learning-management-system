import { mockDeep } from "jest-mock-extended";
import { PrismaClient, User as UserDTO } from "@prisma/client";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";

import { createUserRepository } from "../user.repository";

// Create a deep mock of Prisma
const fakePrisma = mockDeep<PrismaClient>();
const userRepository = createUserRepository(fakePrisma);

describe("UserRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user", async () => {
    const fakeUser: UserDTO = {
      id: "uuid-123",
      email: "test@example.com",
      passwordHash: "hashedpw",
      role: "student",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    fakePrisma.user.create.mockResolvedValue(fakeUser);

    const result = await userRepository.create("test@example.com", "hashedpw");

    expect(result.email).toBe("test@example.com");
    expect(fakePrisma.user.create).toHaveBeenCalledWith({
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

    fakePrisma.user.findUnique.mockResolvedValue(fakeUser);

    const result = await userRepository.findByEmail("findme@example.com");

    expect(result?.email).toBe("findme@example.com");
    expect(fakePrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "findme@example.com" },
    });
  });
});
