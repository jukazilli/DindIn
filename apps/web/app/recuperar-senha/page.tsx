"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { AuthShell } from "../../components/auth-shell";
import { authClient } from "../../lib/auth/client";
import { friendlyAuthError } from "../../lib/auth/friendly-error";

export default function RecuperarSenhaPage() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();

    try {
      const result = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });

      if (result.error) {
        setError(friendlyAuthError(result.error, "reset-request"));
        setPending(false);
        return;
      }

      setSent(true);
      setPending(false);
    } catch (cause) {
      setError(friendlyAuthError(cause, "reset-request"));
      setPending(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Recuperação"
      title="Vamos recuperar seu acesso"
      description="Informe seu e-mail. Se houver uma conta vinculada a ele, você receberá as instruções de recuperação."
    >
      {error ? <p className="feedback feedback-error" role="alert">{error}</p> : null}
      {sent ? (
        <>
          <p className="feedback feedback-success" role="status">Se o e-mail estiver cadastrado, as instruções de recuperação serão enviadas. Confira também spam e lixo eletrônico.</p>
          <Link className="button button-secondary button-full" href="/entrar">Voltar para entrar</Link>
        </>
      ) : (
        <form className="auth-form" onSubmit={requestReset}>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input className="input" id="email" name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" required />
          </div>
          <button className="button button-primary button-full" disabled={pending} type="submit">
            {pending ? "Enviando…" : "Enviar instruções"}
          </button>
        </form>
      )}
      <p className="auth-footer"><Link className="text-link" href="/entrar">Lembrei minha senha</Link></p>
    </AuthShell>
  );
}
