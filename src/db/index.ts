import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "./schema";

const connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString) {
  throw new Error("SUPABASE_DB_URL is not set. Please update your environment variables.");
}

const client = postgres(connectionString, {
  ssl: "require",
  max: 10,
});

export const db = drizzle(client, { schema });

export type DrizzleDB = typeof db;
