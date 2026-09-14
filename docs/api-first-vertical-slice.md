# DindIn — API do Primeiro Vertical Slice

> Status: **implementada; banco real validado; autenticação desacoplada por adapter**  
> Data de referência: **2026-09**

## 1. Objetivo

Este documento registra a primeira API executável do DindIn.

Ela cobre apenas o caminho necessário para validar o núcleo do produto:

```text
perfil
→ conta
→ categoria
→ montar mês
→ orçamento
→ registrar despesa
→ recalcular disponível para gastar
```

O objetivo nesta fase não é expor toda a modelagem do produto.

---

## 2. Separação de camadas

A implementação atual segue esta direção:

```text
HTTP / Hono
    ↓
IdentityProvider
    ↓
Application / DindinService
    ↓
DindinStore (port)
    ↓
┌─────────────────────────┐
│ InMemoryDindinStore     │ testes
│ DrizzleDindinStore      │ PostgreSQL / Neon
└─────────────────────────┘

Application
    ↓
@dindin/domain
    ↓
regras financeiras puras
```

Nenhuma rota HTTP calcula regra financeira diretamente.

O motor `calculateAvailableToSpend()` permanece no package `@dindin/domain`.

---

## 3. Composition root

A infraestrutura real é montada somente em:

```text
apps/api/src/composition.ts
```

Fluxo de desenvolvimento/piloto:

```text
DATABASE_URL
→ createDb()
→ DrizzleDindinStore
→ PilotHeaderIdentityProvider
→ createApiApp()
```

Fluxo preparado para autenticação real:

```text
DATABASE_URL
+ NEON_AUTH_BASE_URL
→ DrizzleDindinStore
→ NeonJwtIdentityProvider
→ createApiApp()
```

Isso impede que Hono, casos de uso e domínio dependam de detalhes de conexão ou de um provedor específico de autenticação.

---

## 4. Contrato monetário

JSON nunca trafega dinheiro como `number` de ponto flutuante.

```text
R$ 512,34
→ "51234"
→ bigint(51234)
```

Na saída:

```text
bigint(51234)
→ "51234"
```

Adapters monetários ficam na fronteira da API/aplicação.

---

## 5. OpenAPI

A API publica o contrato em:

```text
GET /openapi.json
```

Versão atual:

```text
OpenAPI 3.1.0
API 0.1.0
```

O contrato fonte está em:

```text
apps/api/src/http/openapi.ts
```

O documento descreve:

- endpoints;
- payloads de entrada;
- respostas;
- valores monetários em centavos;
- esquema de erro;
- Bearer JWT para ambientes autenticados;
- fallback técnico de identidade do piloto;
- breakdown do `Disponível para gastar`.

---

## 6. Endpoints atuais

```text
GET  /health
GET  /openapi.json
POST /v1/profile
POST /v1/accounts
POST /v1/categories
POST /v1/monthly-plans
POST /v1/budget-definitions
POST /v1/budget-periods
POST /v1/transactions
GET  /v1/monthly-plans/{monthlyPlanId}/available-to-spend
```

---

## 7. Identidade e autenticação

A API não lê mais identidade diretamente como uma regra fixa das rotas.

Contrato:

```text
IdentityProvider.resolve(request)
→ { userId }
```

Implementações atuais:

### PilotHeaderIdentityProvider

Usado apenas em desenvolvimento/piloto pessoal:

```text
x-dindin-user-id: <UUID>
```

> **Não é autenticação de produção.**

### NeonJwtIdentityProvider

Preparado para JWT emitido pelo Managed Better Auth:

```text
Authorization: Bearer <JWT>
```

Valida assinatura via JWKS, algoritmo EdDSA, issuer, audience e identidade do usuário antes de entregar `userId` à aplicação.

A arquitetura completa está registrada em `docs/authentication.md`.

---

## 8. Contrato de erros

Formato:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "monthly plan was not found"
  }
}
```

Códigos atuais:

```text
VALIDATION_ERROR
UNAUTHORIZED
NOT_FOUND
CONFLICT
DOMAIN_INVARIANT
INTERNAL_ERROR
```

Mapeamento HTTP inicial:

```text
400 → validação / invariante de domínio
401 → identidade ausente ou inválida
404 → recurso não encontrado
409 → conflito de estado/constraint
500 → erro inesperado
```

---

## 9. DindinStore

A aplicação depende da interface `DindinStore`.

Implementações atuais:

### InMemoryDindinStore

Usado nos testes HTTP rápidos, sem banco.

### DrizzleDindinStore

Adapter real para `@dindin/db` e PostgreSQL/Neon.

Responsabilidades:

- persistir perfil;
- persistir conta;
- persistir categoria;
- persistir planejamento mensal;
- persistir definição/período de orçamento;
- persistir transação;
- montar a projeção necessária ao motor de `Disponível para gastar`;
- traduzir constraints comuns de PostgreSQL em conflitos de aplicação.

O adapter não implementa a regra financeira final.

---

## 10. Primeiro fluxo HTTP automatizado

O teste rápido executa em memória:

```text
criar perfil
→ criar conta
→ criar categoria
→ criar planejamento de setembro/2026
→ criar orçamento protegido
→ criar orçamento gastável
→ registrar despesas
→ consultar disponível
```

Cenário:

```text
renda                         R$ 2.994
obrigações planejadas         R$ 1.452
consumo/livre planejado       R$ 1.542
obrigações realizadas         R$ 1.452
consumo realizado             R$ 1.030
saída realizada total         R$ 2.482
```

Resultado:

```text
Disponível para gastar = R$ 512
```

---

## 11. Banco real validado

O projeto Neon de desenvolvimento é isolado dos demais produtos:

```text
DindIn-dev
```

`M001–M003` foram validadas primeiro em branch temporária e depois promovidas para a branch principal do ambiente de desenvolvimento.

Foram confirmados:

- tabelas;
- foreign keys;
- CHECK constraints;
- UNIQUEs;
- índices críticos;
- caso piloto de R$ 512.

Detalhes em `docs/database-validation.md`.

---

## 12. Teste de integração com Neon

Existe um teste opt-in em:

```text
apps/api/src/integration/neon-flow.integration.test.ts
```

Ele percorre:

```text
Hono
→ IdentityProvider do piloto
→ DindinService
→ DrizzleDindinStore
→ DindIn-dev
→ domínio
```

Proteções do teste:

- exige `DINDIN_INTEGRATION_TARGET=DindIn-dev`;
- exige `DINDIN_INTEGRATION_DATABASE_URL` fora do código;
- gera UUIDs próprios por execução;
- limpa somente os registros do usuário criado pelo próprio teste;
- não imprime a connection string.

A CI comum não depende de Neon e mantém esse teste `skipped` quando as variáveis não existem.

Também existe workflow manual:

```text
.github/workflows/integration-neon.yml
```

que usa o secret de repositório `DINDIN_INTEGRATION_DATABASE_URL`.

---

## 13. Validação CI

A CI comum valida:

```text
@dindin/contracts
@dindin/db
@dindin/domain
@dindin/api
```

Comandos:

```text
pnpm install
pnpm typecheck
pnpm test
```

Estado após a fronteira de autenticação:

```text
TypeScript: OK nos 4 packages
Domain: 13 testes aprovados
API: testes HTTP aprovados
Integração Neon: opt-in / skipped sem secret
```

Os testes HTTP verificam, entre outros pontos:

1. primeiro vertical slice retornando R$ 512;
2. publicação do OpenAPI;
3. rejeição sem identidade autenticada;
4. injeção de um `IdentityProvider` sem depender de `x-dindin-user-id`.

---

## 14. Próxima fronteira

A próxima decisão externa é provisionar o **Managed Better Auth** no `DindIn-dev` e testar o adapter JWT contra um ambiente real.

Depois:

```text
Managed Better Auth
→ JWT/JWKS real
→ teste autenticado
→ Cloudflare Worker entrypoint
→ secrets/env
→ primeiro deploy dev
→ cliente Web/Mobile consumindo a API
```

Só depois disso entram os próximos domínios:

- recorrências;
- parcelas;
- objetivos;
- Quero comprar;
- necessidades;
- fechamento mensal.

A expansão continua por vertical slices.
