import { createDb } from "@dindin/db";
import { DrizzleDindinStore } from "./adapters/drizzle-store";
import { NeonJwtIdentityProvider } from "./adapters/neon-jwt-identity-provider";
import { PilotHeaderIdentityProvider } from "./adapters/pilot-header-identity-provider";
import { createApiApp } from "./http/app";
import type { IdentityProvider } from "./ports/identity-provider";

/**
 * Database composition boundary. Infrastructure is assembled here so
 * HTTP/application/domain layers do not depend directly on Neon connection
 * details or on a concrete authentication provider.
 */
export function createDatabaseApiApp(
  databaseUrl: string,
  identityProvider: IdentityProvider = new PilotHeaderIdentityProvider(),
) {
  if (!databaseUrl.trim()) {
    throw new Error("DATABASE_URL is required");
  }

  const db = createDb(databaseUrl);
  const store = new DrizzleDindinStore(db);
  return createApiApp(store, identityProvider);
}

export function createNeonAuthDatabaseApiApp(
  databaseUrl: string,
  authBaseUrl: string,
  jwksUrl?: string,
) {
  const identityProvider = new NeonJwtIdentityProvider({
    authBaseUrl,
    ...(jwksUrl === undefined ? {} : { jwksUrl }),
  });

  return createDatabaseApiApp(databaseUrl, identityProvider);
}
