# @dindin/web

Aplicação Web do DindIn em Next.js.

A vertical slice atual implementa a experiência própria de autenticação do produto sobre o Managed Better Auth, mantendo sessão, cookies e JWT como detalhes internos.

## Rotas de autenticação

```text
/entrar
/criar-conta
/recuperar-senha
/redefinir-senha
```

Fluxo técnico:

```text
DindIn Web
→ /api/auth/[...path]
→ Managed Better Auth
→ sessão / JWT
→ IdentityProvider
→ DindIn API
```

O usuário não recebe detalhes de JWT, JWKS, cookies, issuer, provider ou mensagens brutas da infraestrutura.

## Variáveis

Copie `.env.example` para `.env.local` e configure somente no ambiente local/plataforma de deploy:

- `NEON_AUTH_BASE_URL`
- `NEON_AUTH_COOKIE_SECRET`

Nunca versione cookie secret, tokens, credenciais OAuth ou connection strings.

## OAuth Google

No desenvolvimento pode ser utilizado o provider Google compartilhado do Managed Better Auth. Antes do beta público, o DindIn deve configurar credenciais OAuth próprias, domínio estável e callbacks de produção.
