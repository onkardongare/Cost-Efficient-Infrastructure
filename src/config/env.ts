// src/config/env.ts
import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is required`);
  }
  return value;
}

export const APP_CONFIG = {
  PORT: Number(process.env.PORT) || 4000,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN, // ok to be undefined

  // these are required, no defaults
  JWT_SECRET: requireEnv("JWT_SECRET"),
  MONGO_URI: requireEnv("MONGO_URI"),
  MONGO_DB_NAME: requireEnv("MONGO_DB_NAME"),
} as const;
