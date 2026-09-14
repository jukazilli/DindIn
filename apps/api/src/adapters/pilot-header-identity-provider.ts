import { UuidSchema } from "@dindin/contracts";
import type { AuthenticatedIdentity, IdentityProvider } from "../ports/identity-provider";

/**
 * Temporary identity adapter used only during the personal pilot.
 * This is not production authentication: possession of a UUID is enough to
 * impersonate a user. Replace it with a verified token provider before beta.
 */
export class PilotHeaderIdentityProvider implements IdentityProvider {
  async resolve(request: Request): Promise<AuthenticatedIdentity | null> {
    const parsed = UuidSchema.safeParse(request.headers.get("x-dindin-user-id"));
    if (!parsed.success) return null;
    return { userId: parsed.data };
  }
}
