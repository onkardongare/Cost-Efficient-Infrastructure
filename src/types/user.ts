// src/types/user.ts

export type UserRole = "citizen" | "government_officer" | "contractor";

export interface LocationInfo {
  lat?: number;
  lng?: number;
  description?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: LocationInfo;
}

export interface UserRecord extends AuthUser {
  passwordHash: string;
}
