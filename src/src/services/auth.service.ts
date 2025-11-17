import { AuthResponse } from "../models/user.model";

export class AuthService {
  private static readonly API_BASE = "/api/auth";

  static async signIn(email: string, password: string): Promise<AuthResponse> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this.API_BASE}/signin`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // });
    // return response.json();

    // Mock response for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: "1",
            email,
            name: email.includes("admin") ? "Admin User" : "Customer User",
            role: email.includes("admin") ? "admin" : "customer",
            createdAt: new Date().toISOString(),
          },
          token: "mock-jwt-token-" + Math.random(),
        });
      }, 1000);
    });
  }

  static async signUp(
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this.API_BASE}/signup`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password, name })
    // });
    // return response.json();

    // Mock response for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: "2",
            email,
            name,
            role: "customer",
            createdAt: new Date().toISOString(),
          },
          token: "mock-jwt-token-" + Math.random(),
        });
      }, 1000);
    });
  }

  static async signOut(): Promise<void> {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }
}
