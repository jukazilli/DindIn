"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { AuthShell } from "../../components/auth-shell";
import { authClient } from "../../lib/auth/client";
import { friendlyAuthError } from "../../lib/auth/friendly-error";

export default function CriarContaPage() {
  const [pending, setPending] = useState<"email" | "google" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signUpWithGoogle() {
    setPending("google");
    setError(null);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/`,
        errorCallbackURL: `${window.location.origin}/criar-conta?erro=google`,
      });
    } catch (cause) {
      setError(friendlyAuthError(cause, "social"));
      setPending(null);
    }
  }

  async function signUpWithEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending("email");
    setError(null);

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirmation") ?? "");

    if (password !== confirmation) {
      setError("As senhas precisam ser iguais.");
      setPending(null);
      return;
    }

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: `${window.location.origin}/`,
      });

      if (result.error) {
        setError(friendlyAuthError(result.error, "sign-up"));
        setPending(null);
        return;
      }

      window.location.assign("/");
    } catch (cause) {
      setError(friendlyAuthError(cause, "sign-up"));
      setPending(null);
    }
  }

  return (
    <AuthShell
      eyebrow="Comece por aqui"
      title="Crie sua conta"
      description="Seu primeiro passo é simples: criar um acesso. O planejamento financeiro vem depois, no seu ritmo."
    >
      {error ? <p className="feedback feedback-error" role="alert">{error}</p> : null}

      <button className="button button-google button-full" disabled={pending !== null} onClick={signUpWithGoogle} type="button">
        <span className="google-badge" aria-hidden="true">G</span>
        {pending === "google" ? "Abrindo Google…" : "Criar com Google"}
      </button>

      <div className="divider">ou use seu e-mail</div>

      <form className="auth-form" onSubmit={signUpWithEmail}>
        <div className="field">
          <label htmlFor="name">Como podemos chamar você?</label>
          <input className="input" id="name" name="name" type="text" autoComplete="name" minLength={2} placeholder="Seu nome" required />
        </div>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input className="input" id="email" name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" required />
        </div>
        <div className="field">
          <label htmlFor="password">Senha</label>
          <input className="input" id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
          <span className="field-help">Use pelo menos 8 caracteres.</span>
        </div>
        <div className="field">
          <label htmlFor="confirmation">Confirme a senha</label>
          <input className="input" id="confirmation" name="confirmation" type="password" autoComplete="new-password" minLength={8} required />
        </div>

        <button className="button button-primary button-full" disabled={pending !== null} type="submit">
          {pending === "email" ? "Criando conta…" : "Criar minha conta"}
        </button>
      </form>

      <p className="auth-footer">Já tem conta? <Link className="text-link" href="/entrar">Entrar</Link></p>
    </AuthShell>
  );
}
