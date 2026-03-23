import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "drizzle-kit";

const root = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(root, ".env") });

if (!process.env.DATABASE_URL) {
  throw new Error(
    `Missing DATABASE_URL. Create "${resolve(root, ".env")}" with your MySQL connection string (see .env.example).`,
  );
}

/**
 * Use `url` for Drizzle Kit (not host/user/password objects).
 * Object form validates `password` with min length 1 when set — empty local passwords fail.
 * The `url` branch only requires a non-empty connection string.
 */
export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
