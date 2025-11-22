// src/services/auth.service.ts
import bcrypt from "bcryptjs";
import { FastifyInstance } from "fastify";
import { userModel } from "../models/user.model";
import {
  AuthUser,
  LocationInfo,
  UserRecord,
  UserRole,
} from "../types/user";
import { LoginBody, SignupBody, AuthResponse } from "../types/auth";

export const authService = {
  async signup(
    fastify: FastifyInstance,
    payload: SignupBody
  ): Promise<AuthResponse> {
    const { name, email, password, role, location } = payload;

    if (!name || !email || !password || !role) {
      throw new Error("name, email, password, role are required");
    }

    const exists = await userModel.existsByEmail(email);
    if (exists) {
      throw new Error("User with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userRecord: UserRecord = {
      id: "", // will be overridden by Mongo _id
      name,
      email,
      role,
      location,
      passwordHash,
    };

    const created = await userModel.create(userRecord);

    const authUser: AuthUser = {
      id: created.id,
      name: created.name,
      email: created.email,
      role: created.role,
      location: created.location,
    };

    const token = fastify.jwt.sign({ sub: authUser.id, email: authUser.email });

    return { user: authUser, token };
  },

  async login(
    fastify: FastifyInstance,
    payload: LoginBody
  ): Promise<AuthResponse> {
    const { email, password } = payload;

    if (!email || !password) {
      throw new Error("email and password are required");
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new Error("Invalid credentials");
    }

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
    };

    const token = fastify.jwt.sign({ sub: authUser.id, email: authUser.email });

    return { user: authUser, token };
  },

  async logout(): Promise<{ success: boolean }> {
    // stateless JWT: nothing to do server-side
    return { success: true };
  },

  async getMe(email: string): Promise<AuthUser | null> {
    const user = await userModel.findByEmail(email);
    if (!user) return null;

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
    };
    return authUser;
  },
};
