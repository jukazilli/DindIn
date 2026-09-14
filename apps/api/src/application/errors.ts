export type ApplicationErrorCode =
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "CONFLICT";

export class ApplicationError extends Error {
  readonly code: ApplicationErrorCode;

  constructor(code: ApplicationErrorCode, message: string) {
    super(message);
    this.name = "ApplicationError";
    this.code = code;
  }
}
