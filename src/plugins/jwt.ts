// src/plugins/jwt.ts
import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import jwt from "@fastify/jwt";
import { APP_CONFIG } from "../config/env";

import "@fastify/jwt"

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      email: string;
    };
    user: {
      sub: string;
      email: string;
      iat: number;
      exp: number;
    };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
  }
}

import fp from "fastify-plugin";

const jwtPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(jwt, {
    secret: APP_CONFIG.JWT_SECRET,
  });

  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );
};

export default fp(jwtPlugin);
