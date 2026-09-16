import { redirect } from "next/navigation";
import { SignOutButton } from "../components/sign-out-button";
import { getAuth } from "../lib/auth/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: session } = await getAuth().getSession();

  if (!session?.user) {
    redirect("/entrar");
  }

  const firstName = session.user.name?.trim().split(/\s+/)[0] || "você";

  return (
    <main className="home-shell">
      <section className="home-card">
        <span className="auth-eyebrow">Acesso concluído</span>
        <h1>Que bom ter {firstName} por aqui.</h1>
        <p>
          Sua conta está conectada. A próxima etapa do DindIn vai transformar esse acesso em perfil e experiência financeira. Por enquanto, esta tela confirma apenas que você entrou com sucesso.
        </p>
        <div className="home-actions">
          <SignOutButton />
        </div>
      </section>
    </main>
  );
}
