"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { AuthShell } from "../../components/auth-shell";
import { authClient } from "../../lib/auth/client";
import { friendlyAuthError } from "../../lib/auth/friendly-error";

export default function EntrarPage() {
  const [pending, setPending] = useState<"email" | "google" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signInWithGoogle() {
    setPending("google");
    setError(null);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/`,
        errorCallbackURL: `${window.location.origin}/entrar?erro=google`,
      });
    } catch (cause) {
      setError(friendlyAuthError(cause, "social"));
      setPending(null);
    }
  }

  async function signInWithEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending("email");
    setError(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        rememberMe: true,
        callbackURL: `${window.location.origin}/`,
      });

      if (result.error) {
        setError(friendlyAuthError(result.error, "sign-in"));
        setPending(null);
        return;
      }

      window.location.assign("/");
    } catch (cause) {
      setError(friendlyAuthError(cause, "sign-in"));
      setPending(null);
    }
  }

  return (
    <AuthShell
      eyebrow="Boas-vindas"
      title="Entre no seu DindIn"
      description="Acesse sua vida financeira com calma. Seus dados de acesso ficam protegidos e você cuida do que realmente importa: suas finanças."
    >
      {error ? <p className="feedback feedback-error" role="alert">{error}</p> : null}

      <button className="button button-google button-full" disabled={pending !== null} onClick={signInWithGoogle} type="button">
        <span className="google-badge" aria-hidden="true">G</span>
        {pending === "google" ? "Abrindo Google…" : "Continuar com Google"}
      </button>

      <div className="divider">ou entre com e-mail</div>

      <form className="auth-form" onSubmit={signInWithEmail}>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input className="input" id="email" name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" required />
        </div>

        <div className="field">
          <div className="field-row">
            <label htmlFor="password">Senha</label>
            <Link className="text-link text-link-small" href="/recuperar-senha">Esqueci minha senha</Link>
          </div>
          <input className="input" id="password" name="password" type="password" autoComplete="current-password" minLength={8} required />
        </div>

        <button className="button button-primary button-full" disabled={pending !== null} type="submit">
          {pending === "email" ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <p className="auth-footer">Ainda não tem conta? <Link className="text-link" href="/criar-conta">Criar conta</Link></p>
    </AuthShell>
  );
}
