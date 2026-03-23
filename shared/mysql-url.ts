/**
 * Parse mysql:// URLs into options for mysql2 / Drizzle.
 * Sets ssl: false for local MariaDB/MySQL (avoids ECONNRESET with some XAMPP setups).
 */
export function parseMysqlDatabaseUrl(urlString: string) {
  const u = new URL(urlString);
  if (u.protocol !== "mysql:" && u.protocol !== "mysql2:") {
    throw new Error("DATABASE_URL must use mysql:// or mysql2:// (not postgresql://)");
  }
  const database = u.pathname.replace(/^\//, "").split("?")[0];
  if (!database) {
    throw new Error("DATABASE_URL must include a database name, e.g. mysql://root@127.0.0.1:3306/chatsystem");
  }
  const user = decodeURIComponent(u.username || "root");
  const rawPass = u.password !== undefined && u.password !== "" ? decodeURIComponent(u.password) : undefined;

  // Drizzle Kit rejects empty password: '' — omit when using root with no password (typical XAMPP).
  return {
    host: u.hostname,
    port: u.port ? Number(u.port) : 3306,
    user,
    ...(rawPass !== undefined ? { password: rawPass } : {}),
    database,
  };
}
