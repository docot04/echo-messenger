import dotenv from "dotenv";
dotenv.config({ quiet: true });

function requireEnv(name: string, value?: string) {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5000,
  MONGO_URI: requireEnv("MONGO_URI", process.env.MONGO_URI),
  JWT_SECRET: requireEnv("JWT_SECRET", process.env.JWT_SECRET),
  ORIGIN: process.env.ORIGIN || "*",
  DEFAULT_IMAGE: process.env.DEFAULT_IMAGE || "",
};
