import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import * as schema from "./schema";

const connectionString = process.env.SUPABASE_DB_URL;
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

let database: PostgresJsDatabase<typeof schema> | null = null;

if (connectionString) {
  const client = postgres(connectionString, {
    ssl: "require",
    max: 10,
  });
  database = drizzle(client, { schema });
} else if (!isBuildPhase) {
  throw new Error("SUPABASE_DB_URL is not set. Please update your environment variables.");
} else {
  console.warn(
    "[db] SUPABASE_DB_URL is not configured during the build phase. Database access will throw if invoked at build time.",
  );
}

export const db =
  database ??
  (new Proxy(
    {},
    {
      get() {
        throw new Error("SUPABASE_DB_URL is not set. Database access is unavailable during build-time.");
      },
    },
  ) as PostgresJsDatabase<typeof schema>);

export type DrizzleDB = typeof db;
