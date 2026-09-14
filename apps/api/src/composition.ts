import { createDb } from "@dindin/db";
import { DrizzleDindinStore } from "./adapters/drizzle-store";
import { createApiApp } from "./http/app";

/**
 * Production composition boundary.
 * Infrastructure is assembled here so HTTP/application/domain layers do not
 * depend directly on Neon connection details.
 */
export function createDatabaseApiApp(databaseUrl: string) {
  if (!databaseUrl.trim()) {
    throw new Error("DATABASE_URL is required");
  }

  const db = createDb(databaseUrl);
  const store = new DrizzleDindinStore(db);
  return createApiApp(store);
}
