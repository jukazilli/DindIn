# DindIn — Modelo Canônico de “Disponível para gastar”

> Status: **decisão de domínio aprovada para orientar a modelagem**  
> Data de referência: **2026-09**

## 1. Objetivo

Este documento define o significado, a fórmula, os estados e as regras do indicador **Disponível para gastar**.

Essa métrica é central para o DindIn e deve possuir uma única implementação no domínio/API.

Ela não representa saldo bancário, limite de cartão ou simples diferença entre receitas e despesas.

> **Disponível para gastar é o valor que ainda pode ser consumido no período sem invadir dinheiro protegido nem ignorar compromissos conhecidos.**

---

# 2. Princípios

## 2.1 Não é saldo bancário

O usuário pode ter R$ 2.000 em conta e apenas R$ 300 realmente disponíveis para consumo.

Parte desse dinheiro pode já estar destinada a:

- moradia;
- estudos;
- parcelas;
- reserva;
- objetivos;
- necessidades futuras;
- outros compromissos.

## 2.2 Não é limite de crédito

Limite de cartão não aumenta o valor disponível para gastar.

Comprar no crédito altera a forma de pagamento, não a capacidade financeira do usuário.

## 2.3 Dinheiro sem função não é automaticamente “livre”

Se existir valor ainda não distribuído no planejamento, ele permanece como **sem destino**.

Ele só passa a compor o disponível quando o usuário o aloca explicitamente em um orçamento gastável, inclusive um orçamento do tipo `free`/`dinheiro livre`.

Isso preserva a proposta educativa:

> **Todo dinheiro recebe uma função antes de virar permissão de consumo.**

## 2.4 Dinheiro protegido continua protegido mesmo quando muda de conta

Mover R$ 500 da conta corrente para uma poupança não transforma a reserva em despesa e não aumenta o disponível.

Transferências entre contas próprias não alteram o indicador.

---

# 3. Conceitos usados no cálculo

## 3.1 `effective_funds_minor`

Representa os recursos reconhecidos pelo planejamento atual.

No MVP:

```text
effective_funds = effective_income + carry_in_total
```

Onde:

- `effective_income` é a renda prevista enquanto o plano está em modo projetado;
- depois da reconciliação da renda, passa a utilizar a renda efetivamente reconhecida;
- `carry_in_total` representa valores legitimamente carregados de períodos anteriores.

## 3.2 `posted_expenses_minor`

Soma de todas as transações do tipo `expense` e status `posted` no período financeiro.

Não entram:

- receitas;
- transferências entre contas próprias;
- transações anuladas;
- movimentações meramente projetadas.

Compras no cartão contam como despesa no momento em que são registradas, evitando que o usuário “gaste duas vezes” o mesmo orçamento.

## 3.3 `protected_remaining_minor`

Soma do saldo positivo ainda protegido nos orçamentos cujo `spendability = protected`.

Exemplos:

- obrigações ainda não pagas;
- reserva de emergência;
- objetivos;
- necessidades futuras protegidas;
- valor reservado para compromissos.

Para cada orçamento protegido:

```text
protected_remaining = max(capacity - protected_consumption, 0)
```

Um orçamento protegido que foi ultrapassado não produz saldo negativo protegido; o excesso já aparece em `posted_expenses` e reduz o disponível global.

## 3.4 `unfunded_commitments_minor`

Soma de compromissos conhecidos do período que ainda não estão cobertos por um orçamento protegido.

Exemplos:

- parcela com vencimento no período esquecida no planejamento;
- mensalidade recorrente conhecida mas não alocada;
- obrigação fixa removida do planejamento sem cancelamento do compromisso.

Esse valor impede que o usuário aumente artificialmente o disponível apenas deixando uma obrigação fora do orçamento.

## 3.5 `unassigned_positive_minor`

Valor positivo do planejamento que ainda não recebeu uma função.

```text
unassigned = effective_funds - total_allocated
unassigned_positive = max(unassigned, 0)
```

Esse valor não entra automaticamente no disponível.

---

# 4. Fórmula canônica

A fórmula recomendada é:

```text
available_to_spend =
    effective_funds
    - posted_expenses
    - protected_remaining
    - unfunded_commitments
    - unassigned_positive
```

O resultado pode ser positivo, zero ou negativo.

## Interpretação

### Positivo

Existe capacidade de consumo ainda disponível.

### Zero

Todo o dinheiro do período já foi consumido ou protegido.

### Negativo

O usuário consumiu além da capacidade disponível do período.

O sistema não deve esconder esse valor com `max(..., 0)` no domínio.

A UI pode apresentar:

> Você gastou R$ 100 além do disponível deste mês.

---

# 5. Por que não usar apenas a soma dos orçamentos gastáveis

Uma fórmula como:

```text
sum(max(remaining_spendable, 0))
```

é incorreta.

Exemplo:

```text
Compras planejado: R$ 200
Compras gasto:      R$ 250
Lazer planejado:    R$ 300
Lazer gasto:        R$   0
```

Saldo real disponível do conjunto:

```text
R$ 500 planejados - R$ 250 gastos = R$ 250
```

Se ignorássemos o saldo negativo de Compras:

```text
max(-50, 0) + 300 = R$ 300
```

O app superestimaria a capacidade do usuário em R$ 50.

A fórmula canônica evita isso porque todas as despesas realizadas reduzem o disponível global.

---

# 6. Comportamento de obrigações protegidas

Uma obrigação já planejada não deve diminuir o disponível duas vezes quando for paga.

Exemplo:

```text
Renda efetiva:                  R$ 2.000
Moradia protegida restante:      R$ 500
Outros valores gastáveis:      R$ 1.500
```

Antes do pagamento:

```text
2.000 - 0 - 500 = R$ 1.500 disponíveis
```

Após pagar R$ 500 de moradia:

```text
posted_expenses      = R$ 500
protected_remaining  = R$   0

2.000 - 500 - 0 = R$ 1.500 disponíveis
```

O pagamento apenas transforma dinheiro protegido em despesa realizada.

---

# 7. Quando uma obrigação custa mais que o previsto

Exemplo:

```text
Renda:               R$ 2.000
Moradia planejada:     R$ 500
Moradia realizada:     R$ 550
```

Depois do pagamento:

```text
posted_expenses      = R$ 550
protected_remaining  = R$   0
```

O excedente de R$ 50 reduz o disponível global.

Isso é intencional: o dinheiro extra precisou sair de algum lugar.

---

# 8. Reserva e transferências

Reserva não deve ser tratada como despesa só porque o usuário transferiu o dinheiro para outra conta.

Exemplo:

```text
Reserva protegida: R$ 500
Transferência para poupança: R$ 500
```

A transferência:

- não entra em `posted_expenses`;
- não consome a proteção;
- não aumenta nem reduz `available_to_spend`.

Se posteriormente R$ 100 da reserva forem efetivamente usados para uma emergência, a despesa consome R$ 100 do orçamento protegido.

Nesse caso:

- `posted_expenses` aumenta R$ 100;
- `protected_remaining` diminui R$ 100;
- o disponível discricionário permanece igual.

Isso é correto porque o gasto saiu de dinheiro já protegido.

---

# 9. Renda prevista versus renda realizada

O planejamento precisa diferenciar projeção de realidade.

## 9.1 Estado `projected`

Antes da renda principal ser reconciliada:

```text
effective_income = expected_income
```

A UI deve sinalizar que o valor disponível é **planejado**.

## 9.2 Estado `reconciled`

Depois que a renda é confirmada:

```text
effective_income = reconciled_income
```

Se a renda real for maior que a prevista, a diferença surge como valor **sem destino**, não como dinheiro automaticamente gastável.

Exemplo:

```text
Previsto: R$ 3.000
Real:     R$ 3.100
```

Os R$ 100 adicionais passam para `unassigned_positive` até o usuário decidir sua função.

Se a renda real for menor:

```text
Previsto: R$ 3.000
Real:     R$ 2.900
```

O disponível é reduzido imediatamente em R$ 100 ou o planejamento entra em conflito até ser ajustado.

## 9.3 Ajuste proposto para `monthly_plans`

Adicionar conceitualmente:

```text
funding_state               TEXT
reconciled_income_minor     BIGINT nullable
unassigned_carry_in_minor   BIGINT default 0
```

`funding_state`:

```text
projected
reconciled
```

Ainda não gerar migration antes da validação completa do modelo.

---

# 10. Carryover e reserva acumulada

Valores carregados do mês anterior entram tanto nos recursos quanto nos envelopes correspondentes.

Exemplo importante para o caso piloto:

```text
Renda do mês:                  R$ 2.994
Reserva acumulada anterior:      R$ 500
Recursos efetivos:             R$ 3.494
Despesas realizadas:           R$ 2.482
Reserva ainda protegida:         R$ 500
```

Resultado:

```text
3.494 - 2.482 - 500 = R$ 512
```

Portanto é perfeitamente possível mostrar simultaneamente:

```text
Disponível para gastar: R$ 512
Reserva acumulada:      R$ 500
```

sem inconsistência, desde que a reserva seja dinheiro carregado e protegido de períodos anteriores.

### Se os R$ 500 forem uma nova reserva criada neste mês

Então o resultado muda:

```text
Renda:                   R$ 2.994
Despesas:                R$ 2.482
Nova proteção:             R$ 500

Disponível:                 R$ 12
```

A UI deve distinguir **reserva acumulada** de **valor reservado neste mês** quando isso for relevante para compreensão.

---

# 11. Caso piloto atual

Sem considerar uma nova contribuição para reserva no mês:

```text
Renda                     R$ 2.994
Moradia                     R$ 500
Estudos                     R$ 492
Geladeira                   R$ 190
CNH                         R$ 270
Shopee                      R$ 890
Mercado Livre                R$ 70
Cartão Caixa                 R$ 70
-----------------------------------
Despesas                  R$ 2.482
Disponível                  R$ 512
```

Esse R$ 512 só pode ser tratado como canonicamente disponível quando:

- os compromissos conhecidos estiverem cobertos;
- não houver dinheiro protegido adicional do próprio mês ainda não considerado;
- não houver valor positivo sem destino que a política mantenha fora do consumo;
- o plano estiver ativo e consistente.

---

# 12. Modo sem planejamento ativo

O DindIn **não terá uma segunda fórmula oficial** de Disponível para gastar.

Sem `monthly_plan` ativo, a Home deve priorizar uma chamada para ação:

> **Planeje seu mês para descobrir quanto realmente pode gastar.**

Pode mostrar informações auxiliares como:

- receitas registradas;
- despesas registradas;
- saldo das contas;
- compromissos conhecidos.

Mas nenhum desses valores deve receber o mesmo significado do KPI canônico.

Isso evita que o app ensine novamente a lógica incorreta de “saldo = dinheiro disponível”.

---

# 13. Planos inconsistentes

## 13.1 Valor sem destino positivo

Permitido.

O plano pode continuar ativo, mas o valor não entra no disponível.

A UI deve incentivar distribuição.

## 13.2 Planejamento maior que os recursos

```text
unassigned < 0
```

Isso representa um conflito matemático.

Recomendação para o MVP:

- permitir o estado enquanto o plano estiver em `draft`;
- não ativar um plano com déficit não resolvido;
- pedir ajuste de renda ou redução de alocações.

Isso não é uma regra de “proibir compras”; é uma regra para impedir que um planejamento impossível seja tratado como válido.

---

# 14. Compromissos não financiados

Ao criar ou ativar um planejamento, o domínio deve verificar:

- parcelas vencendo no período;
- compromissos recorrentes ativos;
- outras obrigações conhecidas.

Se um compromisso não estiver coberto por orçamento protegido, ele entra em:

```text
unfunded_commitments_minor
```

Assim remover uma conta do planejamento não faz o dinheiro “aparecer”.

A UI pode mostrar:

> Você tem R$ 270 de compromissos ainda sem orçamento neste mês.

---

# 15. Cartão de crédito

No primeiro ciclo, o cartão pode continuar modelado como `financial_account.account_type = credit_card` sem um subsistema completo de faturas.

Regra comportamental:

- compra no cartão reduz o orçamento no momento da compra;
- pagar a fatura não registra a mesma compra novamente como despesa;
- parcelamentos geram compromissos futuros por parcela;
- limite de cartão não participa da fórmula de disponível.

Essa decisão evita o erro clássico de dupla contabilização.

O modelo de fatura detalhado poderá ser introduzido posteriormente sem alterar o conceito de Disponível para gastar.

---

# 16. Parcelamentos e simulação de compra

O motor de `Quero comprar` deve usar o mesmo serviço de domínio do disponível.

Nunca criar uma fórmula paralela apenas para simulação.

## Compra à vista

Uma compra hipotética de R$ 300 reduz o disponível atual em R$ 300, salvo quando o usuário explicitamente replaneja de qual dinheiro protegido ela sairá.

## Compra parcelada

Exemplo:

```text
R$ 2.500 em 10x de R$ 250
```

O impacto não é tratar R$ 2.500 como gasto livre do mês atual.

O motor deve mostrar:

```text
impacto no período atual = parcela que efetivamente incide neste período
impacto futuro = R$ 250 por período durante a duração restante
comprometimento total = R$ 2.500
```

Se a primeira parcela começar apenas no próximo período, o disponível atual não é reduzido pela parcela, mas a projeção futura precisa mostrá-la.

---

# 17. Realoção entre orçamentos

`manual_adjust_minor` isolado é insuficiente para auditoria.

A recomendação para a próxima revisão do modelo é substituí-lo por movimentos explícitos de realocação.

Entidade proposta:

```text
budget_reallocations
```

Campos conceituais:

```text
id                       UUID PK
user_id                  UUID FK
monthly_plan_id          UUID FK
from_budget_period_id    UUID nullable
to_budget_period_id      UUID nullable
amount_minor             BIGINT
reason                   TEXT nullable
created_at               TIMESTAMPTZ
```

Regras:

- `amount_minor > 0`;
- origem e destino não podem ser ambos nulos;
- origem nula significa dinheiro vindo de `unassigned`;
- destino nulo significa dinheiro retornando para `unassigned`;
- origem e destino iguais não são permitidos.

A capacidade de um orçamento passa a ser:

```text
capacity = planned
         + carried_in
         + reallocations_in
         - reallocations_out
```

Isso fornece histórico completo para a pergunta:

> De onde saiu esse dinheiro?

---

# 18. Contrato recomendado da API

Endpoint conceitual:

```text
GET /v1/financial-periods/{periodId}/available-to-spend
```

Resposta:

```json
{
  "periodId": "uuid",
  "currency": "BRL",
  "amountMinor": 51200,
  "state": "ready",
  "fundingState": "reconciled",
  "asOf": "2026-09-13T23:00:00Z",
  "breakdown": {
    "effectiveFundsMinor": 349400,
    "postedExpensesMinor": 248200,
    "protectedRemainingMinor": 50000,
    "unfundedCommitmentsMinor": 0,
    "unassignedPositiveMinor": 0
  },
  "warnings": []
}
```

Possíveis estados:

```text
ready
projected
unplanned
conflict
negative
```

A mesma estrutura deve alimentar:

- Home;
- Dashboard;
- drawer `Entender cálculo`;
- análise de compra;
- replanejamento;
- fechamento mensal.

---

# 19. Invariantes

1. `available_to_spend` nunca é persistido como valor editável.
2. Transferências entre contas próprias não alteram o disponível.
3. Transações `voided` não entram no cálculo.
4. Limite de cartão nunca aumenta o disponível.
5. Valor sem destino positivo não é automaticamente gastável.
6. Obrigações conhecidas sem orçamento continuam reduzindo a disponibilidade.
7. O mesmo gasto não pode reduzir o disponível duas vezes.
8. Pagamento de obrigação previamente protegida apenas troca `protected_remaining` por `posted_expenses`.
9. Um gasto acima de um orçamento reduz o disponível global.
10. O motor de compra utiliza exatamente a mesma regra canônica.
11. Resultado negativo é permitido no domínio e não deve ser truncado para zero.
12. Sem plano ativo não existe KPI canônico de disponível.

---

# 20. Testes obrigatórios antes das migrations

A suíte do domínio deve possuir pelo menos estes casos:

1. mês totalmente planejado sem despesas;
2. pagamento de obrigação protegida sem alterar disponibilidade;
3. gasto discricionário reduzindo disponibilidade;
4. gasto acima do orçamento;
5. obrigação acima do valor planejado;
6. reserva transferida entre contas sem alterar disponibilidade;
7. gasto utilizando reserva protegida;
8. valor positivo sem destino permanecendo fora do disponível;
9. renda real maior que a prevista;
10. renda real menor que a prevista;
11. compromisso conhecido sem orçamento;
12. transação anulada;
13. compra no cartão;
14. parcelamento com primeira parcela no mês atual;
15. parcelamento iniciando no próximo mês;
16. carryover positivo;
17. carryover negativo quando permitido;
18. resultado de disponibilidade negativo;
19. replanejamento entre envelopes;
20. ausência de plano ativo.

---

# 21. Decisão final para o MVP

Para o primeiro release, o DindIn adotará:

- **um único cálculo canônico** de Disponível para gastar;
- planejamento ativo como pré-requisito do KPI principal;
- dinheiro sem destino fora do consumo até ser alocado;
- compromissos conhecidos sempre protegidos, mesmo quando esquecidos no orçamento;
- transferências neutras;
- despesas reais reduzindo o cálculo imediatamente;
- reserva e objetivos protegidos;
- suporte a resultado negativo;
- reconciliação entre renda prevista e realizada;
- análise de compra baseada no mesmo motor;
- realocações auditáveis em vez de ajustes opacos.

Esse modelo deve ser considerado normativo na próxima etapa de schema Drizzle e substituir a fórmula simplificada anteriormente descrita em `data-model-domain-contracts.md`.
