import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import { 
  describe, 
  it, 
  expect, 
  beforeEach, 
  afterAll 
} from "@jest/globals";

import { createUserRepository } from "../../infrastructure/user.repository";
import { createRefreshTokenRepository } from "../../infrastructure/refreshToken.repository";
import { createAuthService } from "../../application/auth.service";
import { authController } from "../auth.controller";

// Create fresh Prisma client pointing to test DB
const prisma = new PrismaClient();
const userRepository = createUserRepository(prisma);
const refreshTokenRepository = createRefreshTokenRepository(prisma);
const authService = createAuthService(userRepository, refreshTokenRepository);

// Override controller’s authService for test wiring
(authController as any).authService = authService;

const app = express();
app.use(bodyParser.json());
app.post("/register", authController.register);
app.post("/login", authController.login);
app.post("/logout", authController.logout);

describe("AuthController Integration (Real DB)", () => {
  beforeEach(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("POST /register → should create user and return tokens", async () => {
    const res = await request(app)
      .post("/register")
      .send({ email: "test@example.com", password: "secret123" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");

    const user = await prisma.user.findUnique({
      where: { email: "test@example.com" },
    });
    expect(user).not.toBeNull();
  });

  it("POST /login → should login existing user", async () => {
    // Create user first
    await request(app)
      .post("/register")
      .send({ email: "login@example.com", password: "secret123" });

    const res = await request(app)
      .post("/login")
      .send({ email: "login@example.com", password: "secret123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });

  it("POST /logout → should remove refresh token", async () => {
    const registerRes = await request(app)
      .post("/register")
      .send({ email: "logout@example.com", password: "secret123" });

    const { refreshToken } = registerRes.body;

    const res = await request(app).post("/logout").send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logged out successfully");

    const exists = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });
    expect(exists).toBeNull();
  });
});
