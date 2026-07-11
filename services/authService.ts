import { apiRequest } from "./api";

interface AuthResponse {
  token: string;
  username: string;
  rol: string;
}

export const authService = {
  login: (username: string, password: string) =>
    apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: { username, password },
    }),

  register: (username: string, password: string, email?: string) =>
    apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: { username, password, email },
    }),
};