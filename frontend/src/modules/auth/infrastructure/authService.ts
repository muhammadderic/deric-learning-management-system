import axios from "axios";

import type { RegisterResponse } from "../domain/interfaces/registerResponse";
import type { RegisterPayload } from "../domain/interfaces/registerPayload";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const authService = {
  // Register user
  register: async (email: string, password: string): Promise<RegisterResponse> => {
    try {
      const payload: RegisterPayload = { email, password };
      const response = await axios.post<RegisterResponse>(`${API_BASE_URL}/api/v1/auth/register`, payload);
      return response.data;
    } catch (error: any) {
      // Handle axios errors
      if (error.response) {
        // Backend returned an error response
        throw new Error(error.response.data.message || "Registration failed");
      } else {
        // Network or other errors
        throw new Error(error.message || "Network error");
      }
    }
  },

  // Login user
  // Login use register payload and response, because for now: login and register have the same payload and response
  login: async (email: string, password: string) => {
    try {
      const payload: RegisterPayload = { email, password };
      const response = await axios.post<RegisterResponse>(`${API_BASE_URL}/api/v1/auth/login`, payload);
      return response.data;
    } catch (error: any) {
      // Handle axios errors
      if (error.response) {
        // Backend returned an error response
        throw new Error(error.response.data.message || "Login failed");
      } else {
        // Network or other errors
        throw new Error(error.message || "Network error");
      }
    }
  },
};
