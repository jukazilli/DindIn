export type ApplicationErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "CONFLICT";

export class ApplicationError extends Error {
  readonly code: ApplicationErrorCode;
  readonly details: unknown;

  constructor(code: ApplicationErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = "ApplicationError";
    this.code = code;
    this.details = details;
  }
}
