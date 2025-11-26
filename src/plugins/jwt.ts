// src/plugins/jwt.ts
import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import jwt from "@fastify/jwt";
import { APP_CONFIG } from "../config/env";
import fp from "fastify-plugin";


declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      id: string;
      email: string;
      role?: string;
    };
    user: {
      id: string;
      email: string;
      role?: string;
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

const jwtPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(jwt, {
    secret: APP_CONFIG.JWT_SECRET,
  });

  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
        // Normalize the verified token payload so handlers can use `user.id`
        // instead of `user.sub`. This keeps code that expects `AuthUser.id`
        // working without changing every handler.
        try {
          const u: any = (request as any).user;
          if (u && !u.id && u.sub) {
            u.id = u.sub;
          }
        } catch (e) {
          // ignore normalization errors
        }
      } catch (err) {
        reply.send(err);
      }
    }
  );
};

export default fp(jwtPlugin);
