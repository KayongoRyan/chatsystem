/**
 * Load `.env` from the current working directory (run `npm run dev` / `npm start` from the project root).
 * Uses `process.cwd()` so it works when the server is bundled to CommonJS (no `import.meta`).
 */
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env") });
