import Link from "next/link";
import { auth } from "../lib/auth/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: session } = await auth.getSession();

  return (
    <main className="shell">
      <section className="card">
        <span className="eyebrow">DindIn · ambiente técnico</span>
        <h1>Validação de autenticação</h1>
        {session?.user ? (
          <>
            <p>
              A sessão do Managed Better Auth está ativa. Use a tela de diagnóstico para validar a emissão do JWT sem expor o token na interface.
            </p>
            <div className="actions">
              <Link className="button button-primary" href="/auth/debug">Abrir diagnóstico</Link>
            </div>
          </>
        ) : (
          <>
            <p>
              Esta página existe apenas durante a validação técnica. Ela não representa a tela final de login do produto.
            </p>
            <div className="actions">
              <Link className="button button-primary" href="/auth/sign-in">Entrar com Google</Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
