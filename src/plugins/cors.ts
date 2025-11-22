import { FastifyInstance, FastifyPluginAsync } from "fastify";
import cors from "@fastify/cors";
import { APP_CONFIG } from "../config/env";
import fp from "fastify-plugin";

const corsPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(cors, {
    origin: [APP_CONFIG.FRONTEND_ORIGIN],
    credentials: true,
  });
};

export default fp(corsPlugin);
