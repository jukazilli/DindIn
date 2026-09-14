import { UuidSchema } from "@dindin/contracts";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { AuthenticatedIdentity, IdentityProvider } from "../ports/identity-provider";

export interface NeonJwtIdentityProviderOptions {
  authBaseUrl: string;
  jwksUrl?: string;
}

/**
 * Verifies Managed Better Auth JWTs for APIs that cannot rely on the browser
 * session cookie. Tokens are verified against the branch-specific JWKS and
 * their subject becomes the DindIn user id.
 */
export class NeonJwtIdentityProvider implements IdentityProvider {
  private readonly issuer: string;
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;

  constructor(options: NeonJwtIdentityProviderOptions) {
    const authUrl = new URL(options.authBaseUrl);
    this.issuer = authUrl.origin;

    const jwksUrl = options.jwksUrl
      ? new URL(options.jwksUrl)
      : new URL(`${options.authBaseUrl.replace(/\/$/, "")}/.well-known/jwks.json`);

    this.jwks = createRemoteJWKSet(jwksUrl);
  }

  async resolve(request: Request): Promise<AuthenticatedIdentity | null> {
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) return null;

    const token = authorization.slice("Bearer ".length).trim();
    if (!token) return null;

    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        algorithms: ["EdDSA"],
        issuer: this.issuer,
        audience: this.issuer,
      });

      const parsedUserId = UuidSchema.safeParse(payload.sub ?? payload.id);
      if (!parsedUserId.success) return null;

      return { userId: parsedUserId.data };
    } catch {
      return null;
    }
  }
}
