export type AuthAction = "sign-in" | "sign-up" | "reset-request" | "reset-password" | "social";

type ErrorShape = {
  status: number | undefined;
  statusCode: number | undefined;
  code: string | undefined;
};

function normalize(error: unknown): ErrorShape {
  if (!error || typeof error !== "object") {
    return { status: undefined, statusCode: undefined, code: undefined };
  }

  const value = error as Record<string, unknown>;
  return {
    status: typeof value.status === "number" ? value.status : undefined,
    statusCode: typeof value.statusCode === "number" ? value.statusCode : undefined,
    code: typeof value.code === "string" ? value.code.toUpperCase() : undefined,
  };
}

export function friendlyAuthError(error: unknown, action: AuthAction): string {
  const normalized = normalize(error);
  const status = normalized.status ?? normalized.statusCode;
  const code = normalized.code ?? "";

  if (status === 429 || code.includes("RATE_LIMIT")) {
    return "Foram feitas muitas tentativas em pouco tempo. Aguarde um momento e tente novamente.";
  }

  if (action === "sign-in" && (status === 401 || code.includes("INVALID_EMAIL_OR_PASSWORD") || code.includes("INVALID_PASSWORD"))) {
    return "E-mail ou senha não conferem. Revise os dados ou recupere sua senha.";
  }

  if (action === "sign-up") {
    return "Não foi possível criar a conta com esses dados. Se você já possui cadastro, tente entrar ou recuperar sua senha.";
  }

  if (action === "reset-request") {
    return "Não conseguimos enviar a recuperação agora. Tente novamente em alguns instantes.";
  }

  if (action === "reset-password") {
    return "Não foi possível redefinir a senha. O link pode ter expirado; solicite um novo e tente novamente.";
  }

  if (action === "social") {
    return "Não foi possível continuar com o Google agora. Tente novamente ou use seu e-mail e senha.";
  }

  return "Não foi possível concluir o acesso agora. Tente novamente em alguns instantes.";
}
