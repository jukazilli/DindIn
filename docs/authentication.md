# DindIn — Autenticação e Identidade

> Status: **fronteira de autenticação implementada; Managed Better Auth provisionado e usuário técnico criado no `DindIn-dev`**  
> Data de referência: **2026-09**

## 1. Objetivo

A autenticação do DindIn deve evoluir sem contaminar regras financeiras, casos de uso ou persistência.

```text
request
→ IdentityProvider
→ userId confiável
→ DindinService
→ domínio / persistência
```

O domínio financeiro nunca valida tokens, cookies ou headers HTTP.

---

## 2. Porta de identidade

A abstração canônica está em:

```text
apps/api/src/ports/identity-provider.ts
```

Contrato:

```text
IdentityProvider.resolve(request)
→ { userId }
→ null quando não autenticado
```

A API recebe um `IdentityProvider` por composição e não conhece o mecanismo concreto de login.

---

## 3. Adapter do piloto

Arquivo:

```text
apps/api/src/adapters/pilot-header-identity-provider.ts
```

Durante o piloto pessoal existe:

```text
x-dindin-user-id: <UUID>
```

> **Este mecanismo não é autenticação segura.**

Ele existe exclusivamente para desenvolvimento e piloto pessoal. Deve permanecer desabilitado em beta e produção pública.

---

## 4. Adapter Managed Better Auth / JWT

Arquivo:

```text
apps/api/src/adapters/neon-jwt-identity-provider.ts
```

O adapter real recebe JWT emitido pelo Managed Better Auth e valida:

- `Authorization: Bearer`;
- assinatura por JWKS;
- algoritmo EdDSA;
- issuer;
- audience;
- `sub` como identificador válido de usuário.

Fluxo:

```text
Web / Mobile
→ Managed Better Auth
→ sessão
→ JWT quando necessário
→ Authorization: Bearer <token>
→ DindIn API
→ NeonJwtIdentityProvider
→ JWKS
→ userId confiável
```

A implementação usa `jose` + `createRemoteJWKSet`.

---

## 5. Estado real do DindIn-dev

O Managed Better Auth foi provisionado na branch principal do projeto `DindIn-dev`, banco `dindin`, usando o provider `better_auth`.

O Neon criou o schema próprio:

```text
neon_auth
```

Foram confirmadas estruturas gerenciadas pelo Neon, incluindo:

```text
neon_auth.user
neon_auth.session
neon_auth.account
neon_auth.verification
neon_auth.jwks
neon_auth.organization
neon_auth.member
neon_auth.invitation
neon_auth.project_config
```

Essas tabelas pertencem ao subsistema de autenticação e não devem ser tratadas como parte do domínio financeiro do DindIn.

A configuração atual possui:

- email/senha habilitado;
- cadastro habilitado;
- verificação de email não obrigatória no ambiente de desenvolvimento;
- `localhost` permitido para desenvolvimento;
- nenhum domínio confiável customizado cadastrado;
- email transacional compartilhado do Neon;
- Google OAuth compartilhado disponibilizado pelo Neon para desenvolvimento.

Importante:

> **Não configuramos credenciais Google próprias do DindIn.**

O provider Google listado atualmente é o provider compartilhado de desenvolvimento fornecido pelo Neon. Antes de produção, OAuth próprio deverá ser configurado e validado separadamente.

---

## 6. Usuário técnico de desenvolvimento

Foi criado um usuário técnico controlado para validar o fluxo real de autenticação.

Dados pessoais do usuário de teste, email e UUID de autenticação **não devem ser versionados** no repositório público.

A criação administrativa gerou:

```text
neon_auth.user
    ↓
neon_auth.account
provider = credential
```

Foi confirmado que a conta `credential` foi criada **sem senha definida**.

Isso é intencional do ponto de vista de segurança desta validação: nenhuma senha será inventada, inserida diretamente no banco ou registrada em código/documentação.

A primeira sessão deverá ser obtida por um fluxo suportado pelo Managed Better Auth, preferencialmente pelo Google OAuth compartilhado de desenvolvimento ou por um fluxo legítimo de definição/reset de senha.

---

## 7. Endpoints de autenticação do ambiente

O ambiente possui um `NEON_AUTH_BASE_URL` e um endpoint JWKS próprios da branch.

Esses valores devem entrar no runtime como variáveis de ambiente, nunca hardcoded na aplicação:

```text
NEON_AUTH_BASE_URL
NEON_AUTH_JWKS_URL
```

O JWKS é público por design; segredos de sessão, banco, OAuth ou SMTP não devem ser versionados.

---

## 8. Composition root

### Piloto pessoal

```text
DATABASE_URL
→ DrizzleDindinStore
→ PilotHeaderIdentityProvider
→ createApiApp
```

### Ambiente autenticado

```text
DATABASE_URL
+ NEON_AUTH_BASE_URL
+ NEON_AUTH_JWKS_URL
→ DrizzleDindinStore
→ NeonJwtIdentityProvider
→ createApiApp
```

Casos de uso e domínio permanecem iguais nos dois cenários.

---

## 9. OpenAPI

As rotas protegidas documentam:

```text
NeonAuthBearer
OU
PilotUserId
```

O fallback do piloto existe apenas para desenvolvimento e não representa a configuração prevista para produção.

---

## 10. Regras de segurança

1. A API nunca aceita `userId` do corpo como identidade.
2. Ownership vem exclusivamente do `IdentityProvider`.
3. Tokens, cookies e connection strings não aparecem em logs ou analytics.
4. O adapter do piloto é desabilitado fora do piloto pessoal.
5. JWT precisa de validação criptográfica completa.
6. `issuer` e `audience` devem corresponder ao ambiente esperado.
7. O JWKS deve pertencer à branch/ambiente correto.
8. Token inválido retorna `401` sem detalhes criptográficos.
9. JWT de acesso não é persistido como dado de domínio.
10. RLS pode atuar como defesa adicional, não como substituto da autorização da aplicação.
11. Senhas nunca são gravadas manualmente em tabelas do schema `neon_auth`.
12. Identificadores e emails de usuários de desenvolvimento não são publicados no repositório.

---

## 11. Sessão Web versus JWT

No Web, a preferência continua sendo sessão/cookie seguro quando o desenho de implantação permitir.

JWT é especialmente útil para:

- API em origem separada;
- aplicativo mobile;
- serviços que não compartilham o cookie do navegador.

Não devemos armazenar tokens manualmente no browser quando a sessão gerenciada puder ser usada.

---

## 12. Estado atual

Já implementado e/ou provisionado:

- `IdentityProvider`;
- `PilotHeaderIdentityProvider`;
- `NeonJwtIdentityProvider`;
- composition root para piloto e JWT;
- OpenAPI com Bearer + fallback do piloto;
- testes HTTP da abstração de identidade;
- `jose` para verificação JWT;
- Managed Better Auth provisionado no `DindIn-dev`;
- schema `neon_auth` criado;
- endpoint JWKS disponível;
- email/senha ativo no ambiente dev;
- Google OAuth compartilhado disponível para desenvolvimento;
- usuário técnico de desenvolvimento criado;
- conta `credential` confirmada sem senha manual.

Ainda falta validar:

- login real interativo;
- criação de sessão real;
- emissão de JWT real;
- validação do JWT real pelo `NeonJwtIdentityProvider`;
- chamada autenticada à DindIn API;
- ownership no PostgreSQL usando a identidade autenticada;
- configuração final de domínio confiável;
- credenciais OAuth próprias;
- política final de sessão Web;
- fluxo Expo/React Native.

---

## 13. Próxima validação

Próximo fluxo:

```text
login interativo legítimo
→ sessão Managed Better Auth
→ emissão de JWT
→ validação no JWKS real
→ NeonJwtIdentityProvider
→ endpoint protegido da DindIn API
→ ownership confirmado no PostgreSQL
```

Essa etapa exige uma autenticação interativa do usuário em navegador. Até lá, não devemos gerar, inventar ou persistir credenciais artificiais para contornar o fluxo real.