// src/plugins/cors.ts
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import cors from "@fastify/cors";
import { APP_CONFIG } from "../config/env";
import fp from "fastify-plugin";

const corsPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(cors, {
    origin: APP_CONFIG.FRONTEND_ORIGIN, // array not needed, string is fine
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
};

export default fp(corsPlugin);
