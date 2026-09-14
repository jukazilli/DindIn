# @dindin/web — Auth Dev Harness

Esta aplicação Next.js é, neste estágio, um harness técnico temporário para validar o Managed Better Auth do DindIn.

Ela não representa a UI final do produto.

## Fluxo

```text
Google OAuth (shared dev provider)
→ Managed Better Auth
→ sessão
→ authClient.token()
→ JWT presente
→ DindIn API /v1/me (quando NEXT_PUBLIC_DINDIN_API_URL estiver configurada)
```

O JWT não é renderizado na interface nem registrado em logs do app.

## Variáveis

Copie `.env.example` para `.env.local` e preencha apenas localmente/na plataforma de deploy:

- `NEON_AUTH_BASE_URL`
- `NEON_AUTH_COOKIE_SECRET`
- `NEXT_PUBLIC_DINDIN_API_URL` (opcional até existir URL da API dev)

Nunca versione cookie secret, tokens ou connection strings.
