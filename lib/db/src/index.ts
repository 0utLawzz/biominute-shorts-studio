import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Use individual PG* env vars (PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE)
// when they are available — these point to the built-in Replit PostgreSQL and
// are always correct inside the Replit environment. Fall back to DATABASE_URL
// only when those vars are absent (e.g. local development outside Replit).
function buildPoolConfig(): pg.PoolConfig {
  if (process.env.PGHOST && process.env.PGDATABASE) {
    return {
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT ?? "5432", 10),
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    };
  }
  if (!process.env.DATABASE_URL) {
    console.warn(
      "[db] WARNING: Neither PGHOST nor DATABASE_URL is set. All database operations will fail.",
    );
  }
  return { connectionString: process.env.DATABASE_URL };
}

export const pool = new Pool(buildPoolConfig());
export const db = drizzle(pool, { schema });

export * from "./schema";
