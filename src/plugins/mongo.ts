import { FastifyInstance, FastifyPluginAsync } from "fastify";
import mongoose from "mongoose";
import { APP_CONFIG } from "../config/env";
import fp from "fastify-plugin";

const mongoPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  try {
    if (!APP_CONFIG.MONGO_URI) {
      fastify.log.error("MONGO_URI is not set in env");
      throw new Error("MONGO_URI is not set in env");
    }

    fastify.log.info(`Connecting to MongoDB...`);

    await mongoose.connect(APP_CONFIG.MONGO_URI, {
      // optional but useful to avoid hanging forever
      serverSelectionTimeoutMS: 5000, // 5 seconds max to try server
    } as any);

    fastify.log.info("✅ Connected to MongoDB");

    fastify.addHook("onClose", async () => {
      await mongoose.connection.close();
      fastify.log.info("MongoDB connection closed");
    });
  } catch (err) {
    fastify.log.error("❌ MongoDB connection error");
    fastify.log.error(err);
    throw err; // important: let Fastify know plugin failed
  }
};

export default fp(mongoPlugin);
