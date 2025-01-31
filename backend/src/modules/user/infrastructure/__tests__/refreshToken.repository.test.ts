import { mockDeep } from "jest-mock-extended";
import { PrismaClient, RefreshToken } from "@prisma/client";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";

import { createRefreshTokenRepository } from "../refreshToken.repository";

// create a deep mock of Prisma
const prisma = mockDeep<PrismaClient>();
const refreshRepo = createRefreshTokenRepository(prisma);

describe("RefreshTokenRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should create a refresh token", async () => {
    const fakeToken: RefreshToken = {
      id: "token-1",
      userId: "user-123",
      token: "refresh-token",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    prisma.refreshToken.create.mockResolvedValue(fakeToken);

    const result = await refreshRepo.create(
      fakeToken.userId,
      fakeToken.token,
      fakeToken.expiresAt
    );

    expect(result).toEqual(fakeToken);
    expect(prisma.refreshToken.create).toHaveBeenCalledWith({
      data: {
        userId: fakeToken.userId,
        token: fakeToken.token,
        expiresAt: fakeToken.expiresAt,
      },
    });
  });

  it("should delete a refresh token", async () => {
    const fakeToken: RefreshToken = {
      id: "token-2",
      userId: "user-123",
      token: "refresh-token-to-delete",
      createdAt: new Date(),
      expiresAt: new Date(),
    };

    prisma.refreshToken.delete.mockResolvedValue(fakeToken);

    const result = await refreshRepo.delete(fakeToken.token);

    expect(result).toEqual(fakeToken);
    expect(prisma.refreshToken.delete).toHaveBeenCalledWith({
      where: { token: fakeToken.token },
    });
  });
});
