// src/types/auth.ts
import { LocationInfo, UserRole, AuthUser } from "./user";

export interface SignupBody {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  location?: LocationInfo;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}
