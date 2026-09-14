"use client";

import { useEffect, useState } from "react";
import { authClient } from "../../../lib/auth/client";

type UserSummary = { id?: string; name?: string; email?: string };
type ApiIdentity = { userId?: string };

export default function AuthDebugPage() {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [jwtReady, setJwtReady] = useState(false);
  const [apiIdentity, setApiIdentity] = useState<ApiIdentity | null>(null);
  const [apiState, setApiState] = useState<"not-configured" | "pending" | "ok" | "error">("not-configured");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function validate() {
      try {
        const sessionResult = await authClient.getSession();
        const sessionData = sessionResult.data as unknown as
          | { user?: UserSummary; session?: { user?: UserSummary } }
          | null;
        const resolvedUser = sessionData?.user ?? sessionData?.session?.user ?? null;

        if (!resolvedUser) {
          if (active) setError("Nenhuma sessão autenticada foi encontrada.");
          return;
        }

        const tokenResult = await authClient.token();
        const tokenData = tokenResult.data as unknown as { token?: string } | null;
        const token = tokenData?.token;

        if (!active) return;
        setUser(resolvedUser);
        setJwtReady(Boolean(token));

        const apiBaseUrl = process.env.NEXT_PUBLIC_DINDIN_API_URL?.replace(/\/$/, "");
        if (!apiBaseUrl || !token) return;

        setApiState("pending");
        const response = await fetch(`${apiBaseUrl}/v1/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (!response.ok) {
          setApiState("error");
          return;
        }

        const body = (await response.json()) as ApiIdentity;
        if (!active) return;
        setApiIdentity(body);
        setApiState("ok");
      } catch {
        if (active) setError("Falha ao validar a sessão/JWT do ambiente de desenvolvimento.");
      }
    }

    void validate();
    return () => {
      active = false;
    };
  }, []);

  async function signOut() {
    await authClient.signOut();
    window.location.href = "/auth/sign-in";
  }

  return (
    <main className="shell">
      <section className="card">
        <span className="eyebrow">Diagnóstico seguro</span>
        <h1>Auth smoke test</h1>
        <p>O JWT nunca é exibido nesta tela. Mostramos apenas se cada etapa técnica foi concluída.</p>
        {error ? <p className="error">{error}</p> : null}
        <div className="status-grid">
          <div className="status-row"><span>Sessão</span><strong className={user ? "good" : "warn"}>{user ? "ativa" : "aguardando"}</strong></div>
          <div className="status-row"><span>Usuário</span><strong>{user?.email ?? user?.name ?? "—"}</strong></div>
          <div className="status-row"><span>JWT</span><strong className={jwtReady ? "good" : "warn"}>{jwtReady ? "emitido" : "aguardando"}</strong></div>
          <div className="status-row"><span>DindIn API</span><strong className={apiState === "ok" ? "good" : apiState === "error" ? "error" : "warn"}>{apiState === "not-configured" ? "ainda não configurada" : apiState}</strong></div>
          <div className="status-row"><span>Identidade retornada</span><strong>{apiIdentity?.userId ? "confirmada" : "—"}</strong></div>
        </div>
        <div className="actions">
          <button className="button button-secondary" onClick={signOut} type="button">Sair</button>
        </div>
      </section>
    </main>
  );
}
