import { describe, expect, it } from "vitest";
import { friendlyAuthError } from "./friendly-error";

describe("friendlyAuthError", () => {
  it("não expõe mensagem bruta do provedor", () => {
    const providerError = { status: 500, message: "JWKS upstream provider exploded" };
    expect(friendlyAuthError(providerError, "sign-in")).toBe(
      "Não foi possível concluir o acesso agora. Tente novamente em alguns instantes.",
    );
  });

  it("traduz credenciais inválidas para uma orientação útil", () => {
    expect(friendlyAuthError({ status: 401 }, "sign-in")).toContain("E-mail ou senha");
  });

  it("usa resposta neutra no cadastro", () => {
    expect(friendlyAuthError({ code: "USER_ALREADY_EXISTS" }, "sign-up")).not.toContain("USER_ALREADY_EXISTS");
  });
});
