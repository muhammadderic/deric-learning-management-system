import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";

import { 
  createUserRepository, 
  IUserRepository 
} from "../infrastructure/user.repository";
import { 
  createRefreshTokenRepository, 
  IRefreshTokenRepository 
} from "../infrastructure/refreshToken.repository";

import { ApiError } from "../../../common/errors/api-error";

const ACCESS_TOKEN_EXP = "15m";
const REFRESH_TOKEN_EXP_DAYS = 7;

// Create service factory with dependency injection
export const createAuthService = (
  userRepository: IUserRepository,
  refreshTokenRepository: IRefreshTokenRepository
) => {
  return {
    async register(email: string, password: string) {
      const existing = await userRepository.findByEmail(email);
      if (existing) throw new ApiError(
        "USER_ALREADY_EXISTS", 
        "User with this email already exists", 
        { email }
      );

      const hash = await bcrypt.hash(password, 10);
      const user = await userRepository.create(email, hash);

      return this.issueTokens(user.id, user.role);
    },

    async login(email: string, password: string) {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new ApiError("INVALID_CREDENTIALS", "Invalid email or password");
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        throw new ApiError("INVALID_CREDENTIALS", "Invalid email or password");
      }

      return this.issueTokens(user.id, user.role);
    },

    async logout(refreshToken: string) {
      await refreshTokenRepository.delete(refreshToken);
    },

    async issueTokens(userId: string, role: string) {
      const accessToken = jwt.sign(
        { userId, role },
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: ACCESS_TOKEN_EXP }
      );

      const refreshToken = uuidv4();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXP_DAYS);

      await refreshTokenRepository.create(userId, refreshToken, expiresAt);

      return { accessToken, refreshToken };
    }
  };
};

const prisma = new PrismaClient();
export const userRepository = createUserRepository(prisma);
export const refreshTokenRepository = createRefreshTokenRepository(prisma);

export const authService = createAuthService(userRepository, refreshTokenRepository);