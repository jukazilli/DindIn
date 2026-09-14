# DindIn — Schema Lógico, Constraints e Índices

> Status: **baseline lógica aprovada antes das migrations**  
> Data de referência: **2026-09**

## 1. Objetivo

Este documento consolida a modelagem de dados do DindIn em uma estrutura lógica pronta para ser traduzida para Drizzle ORM e migrations PostgreSQL.

Ele não contém SQL final nem migrations executáveis. Seu papel é fechar:

- entidades persistidas;
- campos obrigatórios e opcionais;
- cardinalidades;
- estados;
- constraints;
- índices;
- regras de integridade;
- relações com o cálculo canônico de `Disponível para gastar`.

Princípio:

> **Persistir fatos e decisões; calcular projeções e indicadores a partir deles.**

---

# 2. Convenções globais

## 2.1 Identificadores

Entidades de domínio usam `UUID`.

Sempre que fizer sentido para criação offline/retry, o ID pode ser gerado pelo cliente.

## 2.2 Dinheiro

Valores monetários usam unidades menores inteiras:

```text
amount_minor BIGINT
currency CHAR(3)
```

Exemplo:

```text
R$ 512,34 => 51234 / BRL
```

Nenhum campo monetário crítico usa `float` ou `double`.

## 2.3 Datas

- timestamps técnicos: `TIMESTAMPTZ` em UTC;
- datas financeiras locais: `DATE`;
- períodos mensais: `period_year` + `period_month`.

## 2.4 Concorrência otimista

Entidades mutáveis importantes possuem:

```text
version INTEGER NOT NULL DEFAULT 1
```

Updates críticos devem validar a versão recebida.

## 2.5 Ownership

Toda entidade financeira deve ter `user_id` direto ou ownership inequívoco.

Regra preferencial: carregar `user_id` diretamente também em tabelas filhas de alta consulta para:

- autorização;
- índices;
- RLS futuro;
- exportação LGPD;
- debugging.

## 2.6 Exclusão

Fatos financeiros não são apagados silenciosamente.

Preferir:

- `voided` para transações;
- `archived_at` para configurações;
- versão/snapshot para fechamento;
- auditoria para mudanças relevantes.

---

# 3. Enums lógicos

Na primeira implementação, podem ser `TEXT + CHECK` em vez de PostgreSQL ENUM para facilitar evolução.

## 3.1 Conta

```text
checking
savings
cash
wallet
credit_card
other
```

## 3.2 Transação

`transaction_type`:

```text
income
expense
transfer
```

`transaction_status`:

```text
pending
posted
voided
```

`transaction_source_type`:

```text
manual
recurring
installment
import
integration
system
```

## 3.3 Planejamento

`monthly_plan_status`:

```text
draft
active
closed
```

`funding_state`:

```text
projected
reconciled
```

## 3.4 Orçamento

`budget_kind`:

```text
obligation
consumption
reserve
future_need
goal
free
```

`spendability`:

```text
spendable
protected
```

`rollover_mode`:

```text
none
positive_only
full
```

## 3.5 Parcelas

`installment_status`:

```text
scheduled
paid
cancelled
```

## 3.6 Objetivos

`goal_status`:

```text
active
paused
completed
cancelled
```

## 3.7 Compra planejada

`purchase_intent_status`:

```text
considering
planned
purchased
abandoned
```

`purchase_need_level`:

```text
need
want
unsure
```

## 3.8 Necessidade

`need_item_status`:

```text
open
planned
resolved
discarded
```

---

# 4. Identidade e perfil

## 4.1 `profiles`

```text
user_id                  UUID PK
name                     TEXT NOT NULL
locale                   TEXT NOT NULL DEFAULT 'pt-BR'
timezone                 TEXT NOT NULL DEFAULT 'America/Sao_Paulo'
default_currency         CHAR(3) NOT NULL DEFAULT 'BRL'
financial_month_day      SMALLINT NULL
created_at               TIMESTAMPTZ NOT NULL
updated_at               TIMESTAMPTZ NOT NULL
```

Constraints:

```text
financial_month_day IS NULL OR BETWEEN 1 AND 28
```

No MVP, `financial_month_day = null` significa mês-calendário.

---

# 5. Contas financeiras

## 5.1 `financial_accounts`

```text
id                       UUID PK
user_id                  UUID NOT NULL
name                     TEXT NOT NULL
account_type             TEXT NOT NULL
currency                 CHAR(3) NOT NULL
include_in_net_cash      BOOLEAN NOT NULL DEFAULT TRUE
is_active                BOOLEAN NOT NULL DEFAULT TRUE
archived_at              TIMESTAMPTZ NULL
created_at               TIMESTAMPTZ NOT NULL
updated_at               TIMESTAMPTZ NOT NULL
version                  INTEGER NOT NULL DEFAULT 1
```

Constraints:

```text
CHECK account_type IN (...)
CHECK length(currency) = 3
```

Índices:

```text
(user_id, is_active)
(user_id, account_type)
```

Regra: saldo da conta não é `Disponível para gastar`.

---

# 6. Categorias

## 6.1 `categories`

```text
id                       UUID PK
user_id                  UUID NOT NULL
name                     TEXT NOT NULL
category_kind            TEXT NOT NULL
parent_id                UUID NULL
icon_key                 TEXT NULL
is_system                BOOLEAN NOT NULL DEFAULT FALSE
is_active                BOOLEAN NOT NULL DEFAULT TRUE
archived_at              TIMESTAMPTZ NULL
created_at               TIMESTAMPTZ NOT NULL
updated_at               TIMESTAMPTZ NOT NULL
version                  INTEGER NOT NULL DEFAULT 1
```

Constraints:

```text
CHECK category_kind IN ('income','expense','transfer')
CHECK parent_id <> id
```

Regras:

- categoria pai e filha devem pertencer ao mesmo usuário;
- categoria usada historicamente é arquivada, não removida.

Índices:

```text
(user_id, category_kind, is_active)
(user_id, parent_id)
```

---

# 7. Planejamento mensal

## 7.1 `monthly_plans`

Refinamento importante em relação ao modelo inicial.

```text
id                         UUID PK
user_id                    UUID NOT NULL
period_year                SMALLINT NOT NULL
period_month               SMALLINT NOT NULL
status                     TEXT NOT NULL
funding_state              TEXT NOT NULL DEFAULT 'projected'
expected_income_minor      BIGINT NOT NULL
reconciled_income_minor    BIGINT NULL
unassigned_carry_in_minor  BIGINT NOT NULL DEFAULT 0
currency                   CHAR(3) NOT NULL
activated_at               TIMESTAMPTZ NULL
closed_at                  TIMESTAMPTZ NULL
created_at                 TIMESTAMPTZ NOT NULL
updated_at                 TIMESTAMPTZ NOT NULL
version                    INTEGER NOT NULL DEFAULT 1
```

Constraints:

```text
UNIQUE(user_id, period_year, period_month)
CHECK period_month BETWEEN 1 AND 12
CHECK period_year BETWEEN 2000 AND 2200
CHECK expected_income_minor >= 0
CHECK reconciled_income_minor IS NULL OR reconciled_income_minor >= 0
CHECK unassigned_carry_in_minor >= 0
CHECK status IN ('draft','active','closed')
CHECK funding_state IN ('projected','reconciled')
```

Invariantes de aplicação:

- plano `active` não pode ter alocação superior aos recursos efetivos;
- `funding_state = reconciled` exige `reconciled_income_minor` preenchido;
- apenas um plano ativo pode existir para o mesmo período do usuário pela própria unique do período.

`effective_income_minor` é derivado:

```text
CASE funding_state
  WHEN 'projected'  THEN expected_income_minor
  WHEN 'reconciled' THEN reconciled_income_minor
END
```

Índices:

```text
(user_id, status, period_year, period_month)
```

---

# 8. Definições de orçamento

## 8.1 `budget_definitions`

```text
id                       UUID PK
user_id                  UUID NOT NULL
name                     TEXT NOT NULL
budget_kind              TEXT NOT NULL
spendability             TEXT NOT NULL
category_id              UUID NULL
goal_id                  UUID NULL
rollover_mode            TEXT NOT NULL DEFAULT 'none'
is_active                BOOLEAN NOT NULL DEFAULT TRUE
archived_at              TIMESTAMPTZ NULL
created_at               TIMESTAMPTZ NOT NULL
updated_at               TIMESTAMPTZ NOT NULL
version                  INTEGER NOT NULL DEFAULT 1
```

Constraints:

```text
CHECK budget_kind IN (...)
CHECK spendability IN ('spendable','protected')
CHECK rollover_mode IN ('none','positive_only','full')
```

Regras recomendadas:

- `obligation`, `reserve`, `goal` devem ser `protected` por padrão;
- `consumption` e `free` devem ser `spendable` por padrão;
- exceções precisam ser explícitas e auditáveis.

Índices:

```text
(user_id, is_active)
(user_id, category_id)
(user_id, goal_id)
```

---

# 9. Orçamentos por período

## 9.1 `budget_periods`

O campo opaco `manual_adjust_minor` é removido.

```text
id                       UUID PK
user_id                  UUID NOT NULL
monthly_plan_id          UUID NOT NULL
budget_definition_id     UUID NOT NULL
planned_minor            BIGINT NOT NULL
carried_in_minor         BIGINT NOT NULL DEFAULT 0
created_at               TIMESTAMPTZ NOT NULL
updated_at               TIMESTAMPTZ NOT NULL
version                  INTEGER NOT NULL DEFAULT 1
```

Constraints:

```text
UNIQUE(monthly_plan_id, budget_definition_id)
CHECK planned_minor >= 0
CHECK carried_in_minor >= 0
```

Valores derivados:

```text
reallocated_in_minor
reallocated_out_minor
capacity_minor
used_minor
remaining_minor
usage_percent
```

Fórmula:

```text
capacity_minor =
  planned_minor
  + carried_in_minor
  + reallocated_in_minor
  - reallocated_out_minor
```

Índices:

```text
(user_id, monthly_plan_id)
(user_id, budget_definition_id)
(monthly_plan_id, budget_definition_id) UNIQUE
```

---

# 10. Realocações de orçamento

## 10.1 `budget_reallocations`

Substitui qualquer ajuste monetário sem origem/destino explícita.

```text
id                       UUID PK
user_id                  UUID NOT NULL
monthly_plan_id          UUID NOT NULL
from_budget_period_id    UUID NOT NULL
to_budget_period_id      UUID NOT NULL
amount_minor             BIGINT NOT NULL
reason                   TEXT NULL
created_at               TIMESTAMPTZ NOT NULL
created_by               UUID NULL
```

Constraints:

```text
CHECK amount_minor > 0
CHECK from_budget_period_id <> to_budget_period_id
```

Invariantes de aplicação:

- origem e destino pertencem ao mesmo `monthly_plan_id`;
- origem e destino pertencem ao mesmo usuário;
- uma realocação não pode fazer a capacidade da origem ficar negativa;
- realocação não é transação bancária;
- não altera receita nem despesa realizada.

Índices:

```text
(user_id, monthly_plan_id, created_at)
(from_budget_period_id)
(to_budget_period_id)
```

---

# 11. Transações

## 11.1 `transactions`

```text
id                         UUID PK
user_id                    UUID NOT NULL
transaction_type           TEXT NOT NULL
status                     TEXT NOT NULL
amount_minor               BIGINT NOT NULL
currency                   CHAR(3) NOT NULL
description                TEXT NULL
category_id                UUID NULL
source_account_id          UUID NULL
destination_account_id     UUID NULL
budget_period_id           UUID NULL
recurring_commitment_id    UUID NULL
installment_id             UUID NULL
occurred_at                TIMESTAMPTZ NOT NULL
local_date                 DATE NOT NULL
source_type                TEXT NOT NULL
external_reference         TEXT NULL
notes                      TEXT NULL
voided_at                  TIMESTAMPTZ NULL
void_reason                TEXT NULL
created_at                 TIMESTAMPTZ NOT NULL
updated_at                 TIMESTAMPTZ NOT NULL
version                    INTEGER NOT NULL DEFAULT 1
```

Constraints:

```text
CHECK amount_minor > 0
CHECK transaction_type IN ('income','expense','transfer')
CHECK status IN ('pending','posted','voided')
CHECK source_type IN (...)
CHECK source_account_id IS NULL OR destination_account_id IS NULL OR source_account_id <> destination_account_id
```

Invariantes por tipo:

Receita:

```text
transaction_type = income
source_account_id = null
```

Despesa:

```text
transaction_type = expense
destination_account_id = null
```

Transferência:

```text
transaction_type = transfer
source_account_id not null
destination_account_id not null
source_account_id <> destination_account_id
budget_period_id normalmente null
```

Anulação:

```text
status = voided => voided_at not null
```

Índices críticos:

```text
(user_id, local_date DESC)
(user_id, status, local_date DESC)
(user_id, transaction_type, local_date DESC)
(user_id, category_id, local_date DESC)
(user_id, budget_period_id, status)
(user_id, recurring_commitment_id)
(user_id, installment_id)
```

Índice parcial recomendado:

```text
(user_id, external_reference)
WHERE external_reference IS NOT NULL
```

---

# 12. Compromissos recorrentes

## 12.1 `recurring_commitments`

```text
id                       UUID PK
user_id                  UUID NOT NULL
name                     TEXT NOT NULL
category_id              UUID NOT NULL
account_id               UUID NULL
amount_minor             BIGINT NOT NULL
currency                 CHAR(3) NOT NULL
frequency                TEXT NOT NULL DEFAULT 'monthly'
start_date               DATE NOT NULL
end_date                 DATE NULL
day_of_month             SMALLINT NULL
is_active                BOOLEAN NOT NULL DEFAULT TRUE
archived_at              TIMESTAMPTZ NULL
created_at               TIMESTAMPTZ NOT NULL
updated_at               TIMESTAMPTZ NOT NULL
version                  INTEGER NOT NULL DEFAULT 1
```

Constraints:

```text
CHECK amount_minor > 0
CHECK frequency = 'monthly' -- MVP
CHECK day_of_month IS NULL OR day_of_month BETWEEN 1 AND 28
CHECK end_date IS NULL OR end_date >= start_date
```

Índices:

```text
(user_id, is_active)
(user_id, start_date, end_date)
```

---

# 13. Cobertura de compromissos por orçamento

## 13.1 `budget_commitment_allocations`

Entidade nova para tornar explícito quando uma obrigação conhecida está coberta por um orçamento protegido.

```text
id                       UUID PK
user_id                  UUID NOT NULL
monthly_plan_id          UUID NOT NULL
budget_period_id         UUID NOT NULL
recurring_commitment_id  UUID NULL
installment_id           UUID NULL
allocated_minor          BIGINT NOT NULL
created_at               TIMESTAMPTZ NOT NULL
```

Constraint estrutural:

Exatamente uma origem de compromisso deve existir:

```text
(recurring_commitment_id IS NOT NULL) XOR (installment_id IS NOT NULL)
```

Constraints:

```text
CHECK allocated_minor > 0
```

Invariantes:

- `budget_period_id` deve pertencer ao mesmo plano;
- orçamento usado deve ser `protected`;
- soma das coberturas do compromisso no período não pode exceder o valor devido;
- compromisso sem cobertura suficiente compõe `unfunded_commitments_minor`.

Índices:

```text
(user_id, monthly_plan_id)
(recurring_commitment_id)
(installment_id)
(budget_period_id)
```

Essa entidade evita depender apenas de inferência por categoria.

---

# 14. Parcelamentos

## 14.1 `installment_plans`

```text
id                       UUID PK
user_id                  UUID NOT NULL
name                     TEXT NOT NULL
total_amount_minor       BIGINT NOT NULL
currency                 CHAR(3) NOT NULL
total_installments       INTEGER NOT NULL
first_due_date           DATE NOT NULL
category_id              UUID NULL
account_id               UUID NULL
is_active                BOOLEAN NOT NULL DEFAULT TRUE
cancelled_at             TIMESTAMPTZ NULL
created_at               TIMESTAMPTZ NOT NULL
updated_at               TIMESTAMPTZ NOT NULL
version                  INTEGER NOT NULL DEFAULT 1
```

Constraints:

```text
CHECK total_amount_minor > 0
CHECK total_installments > 0
```

Invariante:

```text
SUM(installments.amount_minor) = installment_plans.total_amount_minor
```

## 14.2 `installments`

```text
id                       UUID PK
user_id                  UUID NOT NULL
installment_plan_id      UUID NOT NULL
installment_number       INTEGER NOT NULL
amount_minor             BIGINT NOT NULL
due_date                 DATE NOT NULL
status                   TEXT NOT NULL DEFAULT 'scheduled'
paid_transaction_id      UUID NULL
created_at               TIMESTAMPTZ NOT NULL
updated_at               TIMESTAMPTZ NOT NULL
version                  INTEGER NOT NULL DEFAULT 1
```

Constraints:

```text
UNIQUE(installment_plan_id, installment_number)
CHECK installment_number > 0
CHECK amount_minor > 0
CHECK status IN ('scheduled','paid','cancelled')
```

Invariantes:

- número da parcela <= total de parcelas;
- `paid` exige `paid_transaction_id`;
- uma transação não pode quitar duas parcelas diferentes.

Índices:

```text
(user_id, due_date, status)
(installment_plan_id, installment_number) UNIQUE
(paid_transaction_id) UNIQUE WHERE paid_transaction_id IS NOT NULL
```

---

# 15. Objetivos

## 15.1 `goals`

```text
id                       UUID PK
user_id                  UUID NOT NULL
name                     TEXT NOT NULL
target_amount_minor      BIGINT NOT NULL
currency                 CHAR(3) NOT NULL
target_date              DATE NULL
status                   TEXT NOT NULL DEFAULT 'active'
created_at               TIMESTAMPTZ NOT NULL
updated_at               TIMESTAMPTZ NOT NULL
version                  INTEGER NOT NULL DEFAULT 1
```

Constraints:

```text
CHECK target_amount_minor > 0
CHECK status IN ('active','paused','completed','cancelled')
```

## 15.2 `goal_contributions`

```text
id                       UUID PK
user_id                  UUID NOT NULL
goal_id                  UUID NOT NULL
amount_minor             BIGINT NOT NULL
transaction_id           UUID NULL
local_date               DATE NOT NULL
created_at               TIMESTAMPTZ NOT NULL
```

Constraints:

```text
CHECK amount_minor > 0
```

Índices:

```text
(user_id, goal_id, local_date)
(transaction_id)
```

`goal_progress` é derivado.

---

# 16. Quero comprar

## 16.1 `purchase_intents`

```text
id                       UUID PK
user_id                  UUID NOT NULL
name                     TEXT NOT NULL
estimated_amount_minor   BIGINT NOT NULL
currency                 CHAR(3) NOT NULL
need_level               TEXT NOT NULL
needed_by                DATE NULL
payment_mode             TEXT NULL
installment_count        INTEGER NULL
status                   TEXT NOT NULL DEFAULT 'considering'
linked_goal_id           UUID NULL
created_at               TIMESTAMPTZ NOT NULL
updated_at               TIMESTAMPTZ NOT NULL
version                  INTEGER NOT NULL DEFAULT 1
```

Constraints:

```text
CHECK estimated_amount_minor > 0
CHECK need_level IN ('need','want','unsure')
CHECK status IN ('considering','planned','purchased','abandoned')
CHECK installment_count IS NULL OR installment_count > 0
```

## 16.2 `purchase_analyses`

Snapshot de decisão.

```text
id                           UUID PK
user_id                      UUID NOT NULL
purchase_intent_id           UUID NOT NULL
rule_version                 TEXT NOT NULL
available_before_minor       BIGINT NOT NULL
available_after_minor        BIGINT NOT NULL
monthly_commitment_minor     BIGINT NULL
months_committed             INTEGER NULL
budget_shortfall_minor       BIGINT NOT NULL DEFAULT 0
protected_money_impact_minor BIGINT NOT NULL DEFAULT 0
recommendation_code          TEXT NOT NULL
explanation_snapshot         JSONB NOT NULL
created_at                   TIMESTAMPTZ NOT NULL
```

Regra:

- análise é imutável depois de criada;
- uma nova análise gera novo registro.

Índices:

```text
(user_id, purchase_intent_id, created_at DESC)
```

---

# 17. Coisas que estão faltando

## 17.1 `need_items`

```text
id                       UUID PK
user_id                  UUID NOT NULL
name                     TEXT NOT NULL
estimated_amount_minor   BIGINT NULL
currency                 CHAR(3) NULL
priority                 SMALLINT NULL
needed_by                DATE NULL
status                   TEXT NOT NULL DEFAULT 'open'
purchase_intent_id       UUID NULL
created_at               TIMESTAMPTZ NOT NULL
updated_at               TIMESTAMPTZ NOT NULL
version                  INTEGER NOT NULL DEFAULT 1
```

Constraints:

```text
CHECK estimated_amount_minor IS NULL OR estimated_amount_minor > 0
CHECK priority IS NULL OR priority BETWEEN 1 AND 5
CHECK status IN ('open','planned','resolved','discarded')
```

Índices:

```text
(user_id, status, needed_by)
```

---

# 18. Fechamento mensal

## 18.1 `monthly_closings`

Fechamento é snapshot versionado, não somente consulta dinâmica.

```text
id                       UUID PK
user_id                  UUID NOT NULL
monthly_plan_id          UUID NOT NULL
closing_version          INTEGER NOT NULL
status                   TEXT NOT NULL
snapshot_json            JSONB NOT NULL
calculation_version      TEXT NOT NULL
closed_at                TIMESTAMPTZ NOT NULL
invalidated_at           TIMESTAMPTZ NULL
created_at               TIMESTAMPTZ NOT NULL
```

Constraints:

```text
UNIQUE(monthly_plan_id, closing_version)
CHECK closing_version > 0
```

Regra:

- correção posterior de dado histórico não altera snapshot antigo silenciosamente;
- fechamento pode ser invalidado e regenerado em nova versão.

Índices:

```text
(user_id, closed_at DESC)
(monthly_plan_id, closing_version DESC)
```

---

# 19. Idempotência

## 19.1 `idempotency_keys`

```text
id                       UUID PK
user_id                  UUID NOT NULL
idempotency_key          TEXT NOT NULL
operation                TEXT NOT NULL
request_hash             TEXT NOT NULL
response_status          INTEGER NULL
response_body            JSONB NULL
created_at               TIMESTAMPTZ NOT NULL
expires_at               TIMESTAMPTZ NOT NULL
```

Constraint:

```text
UNIQUE(user_id, idempotency_key, operation)
```

Índice:

```text
(expires_at)
```

---

# 20. Auditoria

## 20.1 `audit_events`

```text
id                       UUID PK
user_id                  UUID NOT NULL
entity_type              TEXT NOT NULL
entity_id                UUID NOT NULL
action                   TEXT NOT NULL
metadata                 JSONB NOT NULL DEFAULT '{}'
created_at               TIMESTAMPTZ NOT NULL
actor_user_id            UUID NULL
```

Não armazenar segredos nem dados financeiros desnecessários no metadata.

Índices:

```text
(user_id, entity_type, entity_id, created_at DESC)
(user_id, created_at DESC)
```

---

# 21. Outbox

## 21.1 `outbox_events`

```text
id                       UUID PK
user_id                  UUID NULL
event_type               TEXT NOT NULL
aggregate_type           TEXT NOT NULL
aggregate_id             UUID NOT NULL
payload                  JSONB NOT NULL
occurred_at              TIMESTAMPTZ NOT NULL
processed_at             TIMESTAMPTZ NULL
attempts                 INTEGER NOT NULL DEFAULT 0
last_error               TEXT NULL
```

Índices:

```text
(processed_at, occurred_at)
(aggregate_type, aggregate_id)
```

Índice parcial recomendado:

```text
(occurred_at)
WHERE processed_at IS NULL
```

---

# 22. Cálculo canônico de Disponível para gastar

Nenhuma coluna `available_to_spend` será persistida como fonte da verdade.

A API calcula:

```text
available_to_spend =
    effective_funds
    - posted_expenses
    - protected_remaining
    - unfunded_commitments
    - unassigned_positive
```

Onde:

```text
effective_funds =
    effective_income
    + unassigned_carry_in
    + soma(carried_in dos envelopes)
```

`unassigned_positive` permanece fora do gasto até ser explicitamente alocado.

`unfunded_commitments` é derivado a partir de:

- parcelas do período;
- compromissos recorrentes do período;
- menos coberturas registradas em `budget_commitment_allocations`.

Esse cálculo deve existir em um único serviço de domínio.

---

# 23. Integridade entre ownerships

Foreign keys sozinhas não garantem que entidades relacionadas pertençam ao mesmo usuário.

A aplicação deve validar sempre:

```text
transaction.user_id = budget_period.user_id
budget_period.user_id = monthly_plan.user_id
allocation.user_id = commitment.user_id
allocation.user_id = budget_period.user_id
installment.user_id = installment_plan.user_id
```

Quando apropriado, a migration pode usar chaves compostas auxiliares para reforçar ownership no banco.

No MVP, a combinação recomendada é:

- FK tradicional;
- validação explícita no domínio;
- testes de integração;
- RLS futuramente como defesa em profundidade.

---

# 24. Constraints que pertencem ao banco

Devem virar `CHECK`, `UNIQUE`, `NOT NULL` ou FK sempre que possível:

- valores monetários positivos;
- mês 1–12;
- dia financeiro válido;
- IDs de origem/destino diferentes;
- enums válidos;
- unique de plano por período;
- unique de orçamento por plano;
- unique de número de parcela;
- unique de idempotency key;
- datas finais >= iniciais.

---

# 25. Invariantes que pertencem ao domínio

Não devem ser forçadas por SQL complicado quando a regra exigir múltiplas entidades:

- plano ativo não pode ter déficit;
- soma das parcelas deve bater com o total;
- parcela não pode ultrapassar quantidade do plano;
- realocação não pode deixar origem inválida;
- compromisso não pode ser coberto acima do valor devido;
- apenas orçamento `protected` cobre obrigação;
- `Quero comprar` usa o mesmo motor de disponível;
- fechamento precisa de cálculo consistente e versionado;
- compra no cartão não pode ser contabilizada duas vezes.

Essas invariantes precisam de testes de domínio e integração.

---

# 26. Estratégia inicial de índices

Não criar índices para toda coluna.

Primeiro ciclo prioriza padrões reais de consulta:

1. Home do mês atual;
2. movimentações por período;
3. orçamento por período;
4. compromissos futuros;
5. parcelas por vencimento;
6. objetivos;
7. últimas análises de compra;
8. fechamento mensal.

Índices compostos devem começar por `user_id` na maioria das tabelas multi-tenant.

Depois do beta, usar `EXPLAIN ANALYZE` e métricas reais antes de criar novos índices.

---

# 27. Ordem revisada das migrations

A divisão lógica recomendada passa a ser:

```text
M001_identity_and_core
  profiles
  financial_accounts
  categories

M002_transactions
  transactions
  idempotency_keys

M003_planning_and_budgets
  monthly_plans
  budget_definitions
  budget_periods
  budget_reallocations

M004_commitments
  recurring_commitments
  installment_plans
  installments
  budget_commitment_allocations

M005_goals
  goals
  goal_contributions

M006_purchase_planning
  purchase_intents
  purchase_analyses
  need_items

M007_closing_and_events
  monthly_closings
  audit_events
  outbox_events
```

A numeração representa dependência lógica. Não significa que todas precisam ser criadas antes do primeiro vertical slice.

---

# 28. Primeiro vertical slice recomendado

O primeiro slice técnico deve provar a arquitetura inteira com o menor conjunto possível.

Escopo:

```text
profile
financial_account
category
monthly_plan
budget_definition
budget_period
transaction
available_to_spend query
```

Fluxo:

```text
criar usuário/perfil
→ montar mês
→ criar orçamento
→ registrar despesa
→ recalcular orçamento
→ recalcular disponível
→ exibir no Web/Mobile
```

Só depois disso avançar para parcelas, objetivos e Quero comprar.

---

# 29. Critérios para iniciar Drizzle/migrations

Podemos avançar para implementação quando estas decisões estiverem estáveis:

- modelo canônico de disponível;
- projected vs reconciled income;
- unassigned não é automaticamente gastável;
- budget reallocation auditável;
- cobertura explícita de compromissos;
- cartão sem dupla contabilização;
- fechamento versionado;
- fatos financeiros não são apagados silenciosamente.

Com essas regras, o schema já está suficientemente definido para a próxima etapa: **schemas Drizzle + migrations M001–M003 do primeiro vertical slice**.
