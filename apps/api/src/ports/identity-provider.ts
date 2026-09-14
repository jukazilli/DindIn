export interface AuthenticatedIdentity {
  userId: string;
}

export interface IdentityProvider {
  resolve(request: Request): Promise<AuthenticatedIdentity | null>;
}
