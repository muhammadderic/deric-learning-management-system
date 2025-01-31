import { Request, Response } from "express";

import { authService } from "../application/auth.service";

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const tokens = await authService.register(email, password);
      return res.status(201).json(tokens);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const tokens = await authService.login(email, password);
      return res.status(200).json(tokens);
    } catch (err: any) {
      return res.status(401).json({ message: err.message });
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
      }

      await authService.logout(refreshToken);
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  },
};
