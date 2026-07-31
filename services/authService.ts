import { apiRequest } from "./api";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  rol: string;
}

export const authService = {
  login: (data: { username: string; password: string }) =>
    apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: data,
    }),

  register: (data: { username: string; email: string; password: string }) =>
    apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: data,
    }),
};