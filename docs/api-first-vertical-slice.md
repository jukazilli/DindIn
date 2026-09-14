# DindIn — API do Primeiro Vertical Slice

> Status: **implementada e validada em CI com adapter em memória + adapter Drizzle compilando**  
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

Fluxo:

```text
DATABASE_URL
→ createDb()
→ DrizzleDindinStore
→ createApiApp()
```

Isso impede que Hono, casos de uso e domínio dependam de detalhes de conexão do Neon.

---

## 4. Contrato monetário

JSON nunca trafega dinheiro como `number` de ponto flutuante.

Exemplo:

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

Adapters:

```text
apps/api/src/adapters/money.ts
```

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
- autenticação temporária do piloto;
- breakdown do `Disponível para gastar`.

---

## 6. Endpoints atuais

### Saúde

```text
GET /health
```

### Perfil

```text
POST /v1/profile
```

### Contas

```text
POST /v1/accounts
```

### Categorias

```text
POST /v1/categories
```

### Planejamento mensal

```text
POST /v1/monthly-plans
```

### Definições de orçamento

```text
POST /v1/budget-definitions
```

### Orçamento no mês

```text
POST /v1/budget-periods
```

### Movimentações

```text
POST /v1/transactions
```

### KPI canônico

```text
GET /v1/monthly-plans/{monthlyPlanId}/available-to-spend
```

---

## 7. Autenticação temporária do piloto

Durante esta etapa existe um mecanismo propositalmente temporário:

```text
x-dindin-user-id: <UUID>
```

Ele serve apenas para manter ownership e autorização explícitos enquanto o adapter definitivo de autenticação ainda não foi conectado.

Regra:

> **O header `x-dindin-user-id` não é mecanismo de autenticação para produção.**

Antes de qualquer beta com usuários externos ele deve ser substituído por uma identidade validada pelo adapter de Auth.

A camada de aplicação continuará recebendo somente um `userId` confiável; a troca de autenticação não deve alterar o domínio.

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
401 → contexto de autenticação ausente ou inválido
404 → recurso não encontrado
409 → conflito de estado/constraint
500 → erro inesperado
```

---

## 9. DindinStore

A aplicação depende da interface:

```text
DindinStore
```

Ela contém apenas as operações necessárias ao primeiro slice.

Implementações atuais:

### InMemoryDindinStore

Usado para testes HTTP e validação do comportamento sem banco.

### DrizzleDindinStore

Adapter real para os schemas já definidos em `@dindin/db`.

Responsabilidades do adapter Drizzle:

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

## 10. Primeiro teste ponta a ponta sem banco

O teste HTTP executa:

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

Resultado esperado e automatizado:

```text
Disponível para gastar = R$ 512
```

---

## 11. Validação CI

A CI valida atualmente quatro packages:

```text
@dindin/contracts
@dindin/db
@dindin/domain
@dindin/api
```

Validações executadas:

```text
pnpm install
pnpm typecheck
pnpm test
```

Resultado atual:

```text
TypeScript: OK nos 4 packages
Domain: 13 testes aprovados
API: 3 testes HTTP aprovados
```

Os testes da API validam:

1. primeiro vertical slice retornando R$ 512;
2. publicação do documento OpenAPI;
3. rejeição de rota protegida sem contexto de usuário.

---

## 12. O que ainda não foi validado

Apesar do adapter Drizzle compilar, ainda falta executar contra um PostgreSQL/Neon real.

Antes de considerar esta camada pronta para ambiente compartilhado precisamos:

1. provisionar ou selecionar um projeto Neon exclusivo do DindIn;
2. aplicar `M001–M003` em uma branch/database de desenvolvimento vazia;
3. executar smoke tests de inserts, FKs, CHECKs e UNIQUEs;
4. executar o mesmo fluxo HTTP usando `DrizzleDindinStore`;
5. comparar o resultado com o adapter em memória;
6. validar geração/snapshots do Drizzle Kit;
7. somente então tratar as migrations como validadas em runtime.

---

## 13. Próxima fronteira

Após a validação real de banco:

```text
Auth adapter
→ Cloudflare Worker entrypoint
→ secrets/env
→ primeiro deploy dev
→ cliente Web/Mobile consumindo a API
```

Só depois disso devem entrar os próximos domínios:

- recorrências;
- parcelas;
- objetivos;
- Quero comprar;
- necessidades;
- fechamento mensal.

A expansão deve continuar por vertical slices.
