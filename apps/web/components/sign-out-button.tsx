"use client";

import { useState } from "react";
import { authClient } from "../lib/auth/client";

export function SignOutButton() {
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    try {
      await authClient.signOut();
    } finally {
      window.location.assign("/entrar");
    }
  }

  return (
    <button className="button button-secondary" disabled={pending} onClick={signOut} type="button">
      {pending ? "Saindo…" : "Sair"}
    </button>
  );
}
