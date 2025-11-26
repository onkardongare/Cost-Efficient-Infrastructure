// src/server.ts
import Fastify from "fastify";
import corsPlugin from "./plugins/cors";
import jwtPlugin from "./plugins/jwt";
import authRoutes from "./routes/auth.routes";
import { APP_CONFIG } from "./config/env";
import mongoPlugin from "./plugins/mongo";
import projectRoutes from "./routes/project.routes";

async function buildServer() {
  const fastify = Fastify({ logger: true });

  await fastify.register(corsPlugin);
  await fastify.register(jwtPlugin);
  await fastify.register(mongoPlugin)

  await fastify.register(authRoutes);
  await fastify.register(projectRoutes);

  return fastify;
}

buildServer()
  .then((fastify) => {
    fastify.listen(
      { port: APP_CONFIG.PORT, host: "0.0.0.0" },
      (err, address) => {
        if (err) {
          fastify.log.error(err);
          process.exit(1);
        }
        fastify.log.info(`Server listening at ${address}`);
      }
    );
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
});
