"use client";

import { useState } from "react";
import { authClient } from "../../../lib/auth/client";

export default function SignInPage() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signInWithGoogle() {
    setPending(true);
    setError(null);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/auth/debug`,
        errorCallbackURL: `${window.location.origin}/auth/sign-in?error=oauth`,
      });
    } catch {
      setError("Não foi possível iniciar o login com Google.");
      setPending(false);
    }
  }

  return (
    <main className="shell">
      <section className="card">
        <span className="eyebrow">Managed Better Auth</span>
        <h1>Entrar no ambiente de desenvolvimento</h1>
        <p>
          Use uma conta Google autorizada para este teste. O DindIn não recebe nem armazena sua senha do Google.
        </p>
        {error ? <p className="error">{error}</p> : null}
        <div className="actions">
          <button className="button button-primary" disabled={pending} onClick={signInWithGoogle} type="button">
            {pending ? "Redirecionando…" : "Entrar com Google"}
          </button>
        </div>
        <div className="note">
          Harness temporário: depois da validação, a experiência final seguirá o Design System oficial do DindIn.
        </div>
      </section>
    </main>
  );
}
