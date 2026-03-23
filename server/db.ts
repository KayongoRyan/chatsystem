import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { parseMysqlDatabaseUrl } from "@shared/mysql-url";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "Missing DATABASE_URL. Add it to .env (MySQL URI, e.g. mysql://root@127.0.0.1:3306/chatsystem).",
  );
}

const credentials = parseMysqlDatabaseUrl(databaseUrl);
const pool = mysql.createPool({
  ...credentials,
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 10_000,
});

export const db = drizzle(pool);
