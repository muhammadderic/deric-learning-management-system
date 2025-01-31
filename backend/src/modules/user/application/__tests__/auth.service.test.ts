import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { createAuthService } from "../auth.service";
import { IUserRepository } from "../../infrastructure/user.repository";
import { IRefreshTokenRepository } from "../../infrastructure/refreshToken.repository";
import { ApiError } from "../../../../common/errors/api-error";

// --- mock third-party libs ---
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("uuid");

describe("AuthService", () => {
  // mock repos
  let userRepo: jest.Mocked<IUserRepository>;
  let refreshRepo: jest.Mocked<IRefreshTokenRepository>;

  // service under test
  let authService: ReturnType<typeof createAuthService>;

  const mockUser = {
    id: "user-123",
    email: "test@example.com",
    passwordHash: "hashed-password",
    role: "student",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    // fresh mocks before every test
    userRepo = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };

    refreshRepo = {
      create: jest.fn(),
      delete: jest.fn(),
    };

    authService = createAuthService(userRepo, refreshRepo);

    jest.clearAllMocks();
  });

  // --- REGISTER ---
  it("should throw if user already exists", async () => {
    userRepo.findByEmail.mockResolvedValue(mockUser);

    await expect(
      authService.register("test@example.com", "password123")
    ).rejects.toThrow(ApiError);

    expect(userRepo.findByEmail).toHaveBeenCalledWith("test@example.com");
  });

  it("should create user and return tokens", async () => {
    userRepo.findByEmail.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password" as never);
    userRepo.create.mockResolvedValue(mockUser);
    (jwt.sign as jest.Mock).mockReturnValue("access-token");
    (uuidv4 as jest.Mock).mockReturnValue("refresh-token");
    refreshRepo.create.mockResolvedValue({
      id: "token-1",
      userId: "user-123",
      token: "refresh-token",
      createdAt: new Date(),
      expiresAt: new Date(),
    });

    const result = await authService.register("test@example.com", "password123");

    expect(result).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
    expect(userRepo.create).toHaveBeenCalledWith(
      "test@example.com",
      "hashed-password"
    );
    expect(refreshRepo.create).toHaveBeenCalled();
  });

  // --- LOGIN ---
  it("should throw if user not found", async () => {
    userRepo.findByEmail.mockResolvedValue(null);

    await expect(
      authService.login("notfound@example.com", "password")
    ).rejects.toThrow(ApiError);
  });

  it("should throw if password is invalid", async () => {
    userRepo.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false as never);

    await expect(
      authService.login("test@example.com", "wrongpass")
    ).rejects.toThrow(ApiError);
  });

  it("should return tokens for valid login", async () => {
    userRepo.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true as never);
    (jwt.sign as jest.Mock).mockReturnValue("access-token");
    (uuidv4 as jest.Mock).mockReturnValue("refresh-token");
    refreshRepo.create.mockResolvedValue({
      id: "token-2",
      userId: "user-123",
      token: "refresh-token",
      createdAt: new Date(),
      expiresAt: new Date(),
    });

    const result = await authService.login("test@example.com", "password123");

    expect(result).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
  });

  // --- LOGOUT ---
  it("should delete refresh token", async () => {
    refreshRepo.delete.mockResolvedValue({
      id: "token-3",
      userId: "user-123",
      token: "refresh-token",
      createdAt: new Date(),
      expiresAt: new Date(),
    });

    await authService.logout("refresh-token");

    expect(refreshRepo.delete).toHaveBeenCalledWith("refresh-token");
  });
});
