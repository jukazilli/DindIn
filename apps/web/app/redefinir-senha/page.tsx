"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { AuthShell } from "../../components/auth-shell";
import { authClient } from "../../lib/auth/client";
import { friendlyAuthError } from "../../lib/auth/friendly-error";

export default function RedefinirSenhaPage() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token"));
    if (params.get("error")) {
      setError("Este link de recuperação não é mais válido. Solicite um novo link para continuar.");
    }
    setReady(true);
  }, []);

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setError("Este link de recuperação não é mais válido. Solicite um novo link para continuar.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirmation") ?? "");

    if (password !== confirmation) {
      setError("As senhas precisam ser iguais.");
      return;
    }

    setPending(true);
    setError(null);

    try {
      const result = await authClient.resetPassword({ newPassword: password, token });
      if (result.error) {
        setError(friendlyAuthError(result.error, "reset-password"));
        setPending(false);
        return;
      }
      setSuccess(true);
      setPending(false);
    } catch (cause) {
      setError(friendlyAuthError(cause, "reset-password"));
      setPending(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Nova senha"
      title="Escolha uma nova senha"
      description="Crie uma senha nova para voltar ao DindIn. O link de recuperação é usado apenas para concluir esta troca."
    >
      {!ready ? <p className="feedback feedback-note">Validando o link…</p> : null}
      {error ? <p className="feedback feedback-error" role="alert">{error}</p> : null}
      {success ? (
        <>
          <p className="feedback feedback-success" role="status">Senha atualizada. Agora você já pode entrar novamente.</p>
          <Link className="button button-primary button-full" href="/entrar">Entrar no DindIn</Link>
        </>
      ) : ready && token ? (
        <form className="auth-form" onSubmit={resetPassword}>
          <div className="field">
            <label htmlFor="password">Nova senha</label>
            <input className="input" id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
            <span className="field-help">Use pelo menos 8 caracteres.</span>
          </div>
          <div className="field">
            <label htmlFor="confirmation">Confirme a nova senha</label>
            <input className="input" id="confirmation" name="confirmation" type="password" autoComplete="new-password" minLength={8} required />
          </div>
          <button className="button button-primary button-full" disabled={pending} type="submit">
            {pending ? "Atualizando…" : "Redefinir senha"}
          </button>
        </form>
      ) : ready ? (
        <Link className="button button-secondary button-full" href="/recuperar-senha">Solicitar novo link</Link>
      ) : null}
    </AuthShell>
  );
}
