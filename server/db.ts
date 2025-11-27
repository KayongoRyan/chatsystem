import { drizzle } from "drizzle-orm/neon-http";
import { createClient } from "@neondatabase/serverless";

const client = createClient({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(client);
