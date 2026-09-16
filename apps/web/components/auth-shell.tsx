import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  return (
    <main className="auth-shell">
      <aside className="auth-brand-panel" aria-label="DindIn">
        <Link className="brand" href="/" aria-label="Ir para o DindIn">
          <span className="brand-mark" aria-hidden="true">D</span>
          <span className="brand-name">DindIn</span>
        </Link>

        <div className="brand-copy">
          <span className="gold-dot" aria-hidden="true" />
          <h2>Seu dinheiro mais presente no seu futuro.</h2>
          <p>
            Organize o hoje sem perder de vista o que você quer construir amanhã. Clareza antes de culpa, intenção antes de impulso.
          </p>
        </div>

        <span className="brand-footnote">Reeducação financeira para decisões mais conscientes.</span>
      </aside>

      <section className="auth-content">
        <div className="auth-card">
          <span className="auth-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p className="auth-description">{description}</p>
          {children}
        </div>
      </section>
    </main>
  );
}
