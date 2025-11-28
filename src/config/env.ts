// src/config/env.ts
import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;

// Optional: enforce in production
if (!jwtSecret && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET must be set in production");
}

export const APP_CONFIG = {
  PORT: Number(process.env.PORT) || 4000,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
  JWT_SECRET: jwtSecret,
  MONGO_URI: process.env.MONGO_URI,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME ,
} as const;
