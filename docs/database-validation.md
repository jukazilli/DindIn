# DindIn — Validação do Banco de Desenvolvimento

Status: **validado em ambiente Neon de desenvolvimento em 14/09/2026**.

Este documento registra a primeira validação real da baseline de banco do DindIn. Ele complementa `docs/logical-schema.md` e as migrations versionadas em `packages/db/migrations`.

## Ambiente

Foi provisionado um projeto Neon exclusivo para o produto:

```text
DindIn-dev
```

O banco utilizado para a baseline é:

```text
dindin
```

Nenhuma credencial ou connection string é versionada no repositório.

## Estratégia de validação

As migrations não foram aplicadas diretamente no branch principal do banco.

O fluxo executado foi:

```text
M001–M003
   ↓
branch temporária Neon
   ↓
criação do schema
   ↓
smoke tests
   ↓
validação de constraints / FKs / índices
   ↓
validação do caso piloto
   ↓
aprovação explícita
   ↓
promoção para main
   ↓
remoção da branch temporária
```

Essa estratégia passa a ser a referência para mudanças estruturais futuras relevantes.

## Migrations promovidas

```text
M001 — identity and core
M002 — transactions
M003 — planning and budgets
```

Durante a validação foi identificada uma melhoria na `M003`: o bloco procedural `DO $$ ... $$` usado apenas para criar uma foreign key de forma condicional foi removido.

Como as migrations do DindIn são versionadas e não devem ser reaplicadas arbitrariamente, a FK passou a ser criada explicitamente com `ALTER TABLE ... ADD CONSTRAINT`. Isso também tornou a migration compatível com o fluxo de preparação/validação do Neon.

## Tabelas validadas

A baseline do primeiro vertical slice contém oito tabelas no schema `public`:

```text
profiles
financial_accounts
categories
transactions
monthly_plans
budget_definitions
budget_periods
budget_reallocations
```

## Constraints verificadas

Foram verificadas, entre outras:

- mês do planejamento entre `1` e `12`;
- ano do planejamento dentro da faixa definida;
- renda esperada não negativa;
- coerência entre `funding_state` e `reconciled_income_minor`;
- valor de transação estritamente positivo;
- transferência exigindo contas de origem e destino diferentes;
- estados permitidos de transação;
- tipos permitidos de conta, categoria e orçamento;
- valores de orçamento não negativos;
- realocação entre dois períodos de orçamento diferentes;
- foreign keys de usuário, conta, categoria, planejamento e orçamento;
- vínculo `transactions.budget_period_id → budget_periods.id`.

Também foi validada a unicidade lógica por meio dos índices:

```text
monthly_plans_user_period_uq
budget_periods_plan_definition_uq
```

## Smoke tests executados

Na branch temporária, o banco rejeitou corretamente cenários inválidos, incluindo:

```text
period_month = 13
amount_minor < 0
transferência com mesma conta de origem e destino
dois planejamentos do mesmo usuário para o mesmo mês
```

Isso comprova que invariantes importantes não dependem exclusivamente da aplicação.

## Caso piloto no banco real

O caso piloto foi reproduzido na branch temporária antes da promoção.

Resultado:

```text
Renda esperada              R$ 2.994
Carry-in                     R$   500
Recursos efetivos            R$ 3.494
Despesas realizadas          R$ 2.482
Protegido restante           R$   500
Disponível para gastar       R$   512
```

O resultado coincide com:

- o modelo de domínio documentado;
- os testes unitários de `@dindin/domain`;
- o fluxo HTTP com `InMemoryDindinStore`.

Portanto, a regra central possui agora três níveis independentes de validação:

```text
domínio puro
   =
API em memória
   =
PostgreSQL / Neon
```

## Estado da main do DindIn-dev

Após aprovação explícita, a migration validada foi aplicada ao branch principal do `DindIn-dev` e a branch temporária foi removida.

O branch principal contém atualmente as oito tabelas da baseline e os índices/constraints esperados.

A `main` permanece sem dados do caso piloto. Os dados usados na validação existiram apenas na branch temporária e não foram promovidos como dados de negócio.

## Regra para próximas migrations

Para `M004` em diante:

1. modelar e revisar a alteração;
2. atualizar schema Drizzle e contratos quando aplicável;
3. gerar uma nova migration — nunca editar uma migration já aplicada;
4. executar CI;
5. preparar a migration em branch temporária Neon;
6. executar smoke/integration tests;
7. revisar schema, constraints e índices;
8. solicitar aprovação antes da promoção;
9. promover para `DindIn-dev/main`;
10. somente depois considerar promoção para ambientes superiores.

## Próxima etapa

Com `M001–M003` validadas em PostgreSQL real, a próxima etapa do primeiro vertical slice é executar a **API Hono usando `DrizzleDindinStore` contra o `DindIn-dev`**.

Objetivo:

```text
HTTP
→ DindinService
→ DrizzleDindinStore
→ Neon PostgreSQL
→ motor de domínio
→ resposta HTTP
```

O teste deve percorrer o fluxo completo:

```text
perfil
→ conta
→ categoria
→ montar mês
→ criar orçamentos
→ registrar despesas
→ consultar Disponível para gastar
→ obter R$ 512 no caso piloto
```

Somente depois desse teste ponta a ponta o primeiro vertical slice de backend será considerado validado em infraestrutura real.
