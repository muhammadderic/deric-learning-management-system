import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { v4 as uuidv4 } from "uuid";
import { ApiError } from "../../../../common/errors/api-error";
import { refreshTokenRepository } from "../../infrastructure/refreshToken.repository";
import { userRepository } from "../../infrastructure/user.repository";
import { authService } from "../auth.service";

// Mock dependencies
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("uuid");
jest.mock("../../infrastructure/user.repository");
jest.mock("../../infrastructure/refreshToken.repository");

describe("AuthService", () => {
  const mockUser = {
    id: "user-123",
    email: "test@example.com",
    passwordHash: "hashed-password",
    role: "user"
  };

  const mockTokens = {
    accessToken: "access-token-123",
    refreshToken: "refresh-token-456"
  };

  let originalDateNow: () => number;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_ACCESS_SECRET = "test-secret";

    // Mock Date for consistent testing (compatible approach)
    originalDateNow = Date.now;
    const fixedDate = new Date('2025-09-05T04:04:31.085Z').getTime();
    Date.now = jest.fn(() => fixedDate);
  });

  afterEach(() => {
    // Restore original Date implementation
    Date.now = originalDateNow;
  });

  describe("register", () => {
    it("should register a new user and return tokens", async () => {
      // Arrange
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null as never);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password" as never);
      (userRepository.create as jest.Mock).mockResolvedValue(mockUser as never);
      (jwt.sign as jest.Mock).mockReturnValue(mockTokens.accessToken);
      (uuidv4 as jest.Mock).mockReturnValue(mockTokens.refreshToken);
      (refreshTokenRepository.create as jest.Mock).mockResolvedValue(undefined as never);

      // Act
      const result = await authService.register("test@example.com", "password123");

      // Assert
      expect(userRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(userRepository.create).toHaveBeenCalledWith("test@example.com", "hashed-password");
      expect(result).toEqual(mockTokens);
    });

    it("should throw ApiError when user already exists", async () => {
      // Arrange
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser as never);

      // Act & Assert
      await expect(authService.register("test@example.com", "password123"))
        .rejects
        .toThrow(ApiError);

      expect(userRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should login user with valid credentials and return tokens", async () => {
      // Arrange
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser as never);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true as never);
      (jwt.sign as jest.Mock).mockReturnValue(mockTokens.accessToken);
      (uuidv4 as jest.Mock).mockReturnValue(mockTokens.refreshToken);
      (refreshTokenRepository.create as jest.Mock).mockResolvedValue(undefined as never);

      // Act
      const result = await authService.login("test@example.com", "password123");

      // Assert
      expect(userRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("password123", mockUser.passwordHash);
      expect(result).toEqual(mockTokens);
    });

    it("should throw ApiError when user does not exist", async () => {
      // Arrange
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null as never);

      // Act & Assert
      await expect(authService.login("nonexistent@example.com", "password123"))
        .rejects
        .toThrow(ApiError);

      expect(userRepository.findByEmail).toHaveBeenCalledWith("nonexistent@example.com");
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it("should throw ApiError when password is invalid", async () => {
      // Arrange
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser as never);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false as never);

      // Act & Assert
      await expect(authService.login("test@example.com", "wrong-password"))
        .rejects
        .toThrow(ApiError);

      expect(userRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("wrong-password", mockUser.passwordHash);
    });
  });

  describe("logout", () => {
    it("should delete refresh token", async () => {
      // Arrange
      (refreshTokenRepository.delete as jest.Mock).mockResolvedValue(undefined as never);

      // Act
      await authService.logout("refresh-token-456");

      // Assert
      expect(refreshTokenRepository.delete).toHaveBeenCalledWith("refresh-token-456");
    });
  });

  describe("issueTokens", () => {
    it("should issue access and refresh tokens", async () => {
      // Arrange
      const expiresAt = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => expiresAt as unknown as string as never);
      
      (jwt.sign as jest.Mock).mockReturnValue(mockTokens.accessToken);
      (uuidv4 as jest.Mock).mockReturnValue(mockTokens.refreshToken);
      (refreshTokenRepository.create as jest.Mock).mockResolvedValue(undefined as never);

      // Act
      const result = await authService.issueTokens("user-123", "user");

      // Assert
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: "user-123", role: "user" },
        "test-secret",
        { expiresIn: "15m" }
      );
      
      expect(uuidv4).toHaveBeenCalled();
      
      // Calculate expected expiration date (7 days from now)
      const expectedExpiresAt = new Date();
      expectedExpiresAt.setDate(expectedExpiresAt.getDate() + 7);
      
      expect(refreshTokenRepository.create).toHaveBeenCalledWith(
        "user-123",
        mockTokens.refreshToken,
        expectedExpiresAt
      );
      
      expect(result).toEqual({
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken
      });
    });

    it("should throw error if JWT_ACCESS_SECRET is not set", async () => {
      // Arrange
      const originalSecret = process.env.JWT_ACCESS_SECRET;
      delete process.env.JWT_ACCESS_SECRET;

      // Mock jwt.sign to throw an error when secret is missing
      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw new Error("JWT secret is required");
      });

      // Act & Assert
      await expect(authService.issueTokens("user-123", "user"))
        .rejects
        .toThrow("JWT secret is required");

      // Restore the original secret
      process.env.JWT_ACCESS_SECRET = originalSecret;
    });
  });
});