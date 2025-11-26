// src/routes/auth.routes.ts
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { authService } from "../services/auth.service";
import { LoginBody, SignupBody } from "../types/auth";

const authRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Signup
  fastify.post<{ Body: SignupBody }>("/auth/signup", async (request, reply) => {
    try {
      console.log("Signup request body:", request.body);
      const data = await authService.signup(fastify, request.body);
      return reply.send(data);
    } catch (err: any) {
      return reply.status(400).send({ message: err.message ?? "Signup failed" });
    }
  });

  // Login
  fastify.post<{ Body: LoginBody }>("/auth/login", async (request, reply) => {
    try {
      const data = await authService.login(fastify, request.body);
      return reply.send(data);
    } catch (err: any) {
      return reply.status(401).send({ message: err.message ?? "Login failed" });
    }
  });

  // Logout
  fastify.post("/auth/logout", async (_request, reply) => {
    const res = await authService.logout();
    return reply.send(res);
  });

  // Me (requires JWT)
  fastify.get(
    "/auth/me",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const email = (request.user as any).email as string;
      const user = await authService.getMe(email);
      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }
      return reply.send({ user });
    }
  );
};

export default fp(authRoutes);
