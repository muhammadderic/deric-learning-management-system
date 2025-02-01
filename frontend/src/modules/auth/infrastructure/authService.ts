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

  // Example: login function (for future use)
  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, { email, password });
    return response.data;
  },
};
