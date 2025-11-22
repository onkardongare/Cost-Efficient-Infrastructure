// src/config/env.ts
import "dotenv/config";

export const APP_CONFIG = {
  PORT: Number(process.env.PORT) || 4000,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
  JWT_SECRET: process.env.JWT_SECRET || "supersecret",
  MONGO_URI: process.env.MONGO_URI || "",
  MONGO_DB_NAME: process.env.MONGO_DB_NAME || "infra_db",
};
