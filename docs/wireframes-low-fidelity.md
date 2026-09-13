# DindIn — Wireframes Low-Fidelity

## 1. Objetivo

Este documento transforma os fluxos aprovados do DindIn em estruturas de tela antes da definição visual final.

O objetivo dos wireframes low-fidelity é validar:

- hierarquia da informação;
- posição relativa dos elementos;
- prioridade das ações;
- comportamento entre desktop, tablet e mobile;
- uso de páginas, drawers e modais;
- continuidade entre os fluxos principais.

Nesta etapa não devem ser tomadas decisões finais sobre:

- ilustração;
- microanimações;
- ícones definitivos;
- sombras;
- acabamento de cards;
- detalhes da paleta;
- composição tipográfica final.

A direção visual oficial continua definida em `design-ui-ux.md`.

> **Primeiro resolvemos a tarefa. Depois refinamos a aparência.**

---

## 2. Regras gerais de layout

### Desktop

Referência principal: 1440 px.

- sidebar fixa ou semi-fixa à esquerda;
- conteúdo central com largura máxima controlada;
- 12 colunas como referência de grid;
- dashboard com 2 a 3 colunas conforme importância;
- drawers laterais para inspeção e edição rápida;
- evitar abrir páginas novas para pequenas alterações.

### Tablet

Referência principal: 1024 px.

- manter comportamento analítico de desktop;
- reduzir para 2 colunas quando necessário;
- sidebar pode recolher para versão compacta;
- drawers podem ocupar proporção maior da tela;
- não transformar tablet em layout mobile prematuramente.

### Mobile

Referência principal: 390 px.

- uma coluna;
- ações rápidas acima de análise detalhada;
- formulários curtos;
- detalhes avançados progressivamente revelados;
- bottom navigation persistente;
- botão central de ação rápida.

---

# 3. Wireframe 01 — Visão geral / Dashboard

## Objetivo mental

> **Entender rapidamente como está o mês e onde agir.**

### Desktop / tablet landscape

```text
┌──────────────┬───────────────────────────────────────────────────────────────┐
│ DindIn       │ Setembro 2026                     [+ Receita] [+ Despesa]    │
│              │                                                       [•••]  │
│ Visão geral  ├───────────────────────────────────────────────────────────────┤
│ Movimentos   │                                                               │
│ Orçamentos   │  ┌──────────────────────────┐  ┌───────────┐ ┌────────────┐  │
│ Planejamento │  │ DISPONÍVEL PARA GASTAR   │  │ Receitas  │ │ Despesas   │  │
│ Parcelas     │  │                          │  │ R$ 2.994  │ │ R$ 2.482   │  │
│ Objetivos    │  │ R$ 512                   │  └───────────┘ └────────────┘  │
│ Quero comprar│  │ até próximo salário      │                               │
│              │  │ [Entender cálculo]       │  ┌───────────────────────────┐│
│              │  └──────────────────────────┘  │ Reservado     R$ 500      ││
│              │                                │ Comprometido   83%         ││
│              │                                └───────────────────────────┘│
│              │                                                               │
│              │  ┌─────────────────────────────┐ ┌─────────────────────────┐ │
│              │  │ ORÇAMENTOS                  │ │ FLUXO DO MÊS            │ │
│              │  │ Compras      84%            │ │                         │ │
│              │  │ Mercado      70%            │ │ entradas x saídas       │ │
│              │  │ Lazer        40%            │ │                         │ │
│              │  │ [Ver todos]                 │ │                         │ │
│              │  └─────────────────────────────┘ └─────────────────────────┘ │
│              │                                                               │
│              │  ┌─────────────────────────────┐ ┌─────────────────────────┐ │
│              │  │ COMPROMISSOS FUTUROS       │ │ O QUE PEDE ATENÇÃO      │ │
│              │  │ Out   R$ ...                │ │ Compras +R$ 330         │ │
│              │  │ Nov   R$ ...                │ │ Reserva em construção   │ │
│              │  │ Dez   R$ ...                │ │ [Revisar]               │ │
│              │  └─────────────────────────────┘ └─────────────────────────┘ │
│              │                                                               │
│              │  Próximos compromissos                                        │
│              │  Geladeira 10/10 • R$190 • termina este mês                  │
│              │  CNH        3/7   • R$270 • restam 4 parcelas                │
└──────────────┴───────────────────────────────────────────────────────────────┘
```

### Hierarquia

1. Disponível para gastar.
2. Receitas, despesas, reservado e comprometimento.
3. Orçamentos e fluxo do mês.
4. Compromissos futuros e alertas acionáveis.
5. Próximas parcelas.

### Comportamentos

- clicar em uma métrica abre explicação ou drawer;
- clicar em categoria de orçamento abre detalhes sem sair da Home;
- `Entender cálculo` explica como o disponível foi formado;
- alertas devem levar diretamente para uma correção possível;
- o dashboard não deve mostrar todos os dados existentes, apenas os que orientam decisão.

---

# 4. Wireframe 02 — Montar meu mês

## Objetivo mental

> **Dar uma função para o dinheiro antes que ele seja gasto.**

```text
┌──────────────┬───────────────────────────────────────────────────────────────┐
│ sidebar      │ Montar meu mês — Outubro 2026                               │
│              │                                                               │
│              │ Renda prevista                                                │
│              │ ┌───────────────────────────────────────────────────────────┐ │
│              │ │ R$ 2.994                                   [editar]      │ │
│              │ └───────────────────────────────────────────────────────────┘ │
│              │                                                               │
│              │ Distribuição                                                  │
│              │                                                               │
│              │ Obrigações                  R$ 1.262                          │
│              │ ├ Moradia                     500                             │
│              │ ├ Estudos                     492                             │
│              │ └ CNH                         270                             │
│              │                                                               │
│              │ Limites de consumo          R$   700                          │
│              │ ├ Mercado                     350                             │
│              │ ├ Compras                     200                             │
│              │ └ Lazer                       150                             │
│              │                                                               │
│              │ Reservas                    R$   600                          │
│              │ ├ Emergência                  500                             │
│              │ └ Necessidades futuras        100                             │
│              │                                                               │
│              │ ┌──────────────────────────────┐                              │
│              │ │ Ainda sem destino            │                              │
│              │ │ R$ 432                       │                              │
│              │ └──────────────────────────────┘                              │
│              │                                                               │
│              │ [+ Adicionar orçamento]               [Concluir planejamento]│
└──────────────┴───────────────────────────────────────────────────────────────┘
```

### Regras

- o usuário sempre vê a renda disponível para distribuir;
- cada alteração recalcula `Ainda sem destino`;
- valor negativo deve ser tratado como conflito de planejamento, não como erro técnico;
- `Concluir planejamento` pode ser usado mesmo com valor sem destino, mas o sistema deve explicar a consequência;
- o objetivo educativo é incentivar que o dinheiro receba função antes do consumo.

---

# 5. Wireframe 03 — Orçamentos

## Objetivo mental

> **Saber quanto ainda posso usar em cada finalidade.**

```text
┌──────────────┬───────────────────────────────────────────────────────────────┐
│ sidebar      │ Orçamentos — Setembro 2026                  [+ Orçamento]    │
│              │                                                               │
│              │ Planejado R$ 2.800   Usado R$ 2.050   Restante R$ 750        │
│              │                                                               │
│              │ [Todos] [Obrigações] [Consumo] [Reservas]                    │
│              │                                                               │
│              │ Categoria        Planejado    Usado     Restante    Status    │
│              │ ───────────────────────────────────────────────────────────── │
│              │ Moradia          500          500       0           Concluído │
│              │ Estudos          492          492       0           Concluído │
│              │ Mercado          400          280       120         Dentro    │
│              │ Compras          250          210       40          Atenção   │
│              │ Lazer            150           60       90          Dentro    │
│              │ Emergência       500          500       0           Protegido │
│              │                                                               │
│              │ [Selecionar linha → abre drawer de orçamento]                 │
└──────────────┴───────────────────────────────────────────────────────────────┘
```

### Drawer de orçamento

```text
┌──────────────────────────────┐
│ Compras pessoais        [x] │
│                              │
│ Limite mensal                │
│ R$ 250                       │
│                              │
│ Utilizado                    │
│ R$ 210                       │
│                              │
│ Restante                     │
│ R$ 40                        │
│                              │
│ Acumula saldo?  [Sim]        │
│                              │
│ Movimentações recentes       │
│ Shopee              R$ 120   │
│ Camiseta             R$  90  │
│                              │
│ [Editar] [Replanejar]        │
└──────────────────────────────┘
```

---

# 6. Wireframe 04 — Home mobile

## Objetivo mental

> **Ver o essencial e agir rapidamente.**

```text
┌─────────────────────────────┐
│ DindIn                 [○] │
│                             │
│ Disponível até o salário    │
│                             │
│ R$ 512                      │
│                             │
│ [ + Despesa ] [ + Receita ] │
│                             │
│ Orçamentos                  │
│ Mercado       R$120 restante│
│ Compras        R$40 restante│
│ Lazer          R$90 restante│
│                     Ver todos│
│                             │
│ Hoje                        │
│ Mercado             - R$ 48 │
│ Transporte          - R$ 30 │
│                             │
│ Um ponto de atenção         │
│ Compras já usou 84%         │
│ [Ver orçamento]             │
│                             │
├─────────────────────────────┤
│ Hoje   Movimentos   [+] ... │
└─────────────────────────────┘
```

### Regra

A Home mobile não deve mostrar gráficos analíticos extensos. Seu papel é responder:

- quanto posso gastar;
- qual orçamento está perto do limite;
- o que aconteceu recentemente;
- qual ação preciso registrar agora.

---

# 7. Wireframe 05 — Registrar despesa mobile

## Objetivo mental

> **Registrar uma despesa em poucos segundos.**

### Estado inicial

```text
┌─────────────────────────────┐
│ ← Registrar despesa         │
│                             │
│ Quanto você gastou?         │
│                             │
│ R$ 0,00                     │
│                             │
│ Descrição                   │
│ [_________________________] │
│                             │
│ Categoria                   │
│ [ Mercado              ▾ ]  │
│                             │
│ Forma                       │
│ [Pix] [Cartão] [Dinheiro]   │
│                             │
│ Mais opções                 │
│                             │
│ [ Registrar despesa ]       │
└─────────────────────────────┘
```

### Após informar valor

O sistema pode mostrar uma consequência curta antes do botão final:

```text
Mercado
R$ 120 disponíveis → R$ 72 após esta compra
```

### Caso ultrapasse orçamento

```text
Esta despesa ultrapassa Mercado em R$ 18.

[Replanejar]    [Registrar mesmo assim]
```

A mensagem não deve impedir o usuário de registrar o que já aconteceu.

---

# 8. Wireframe 06 — Ação rápida central mobile

```text
┌─────────────────────────────┐
│                             │
│      O que quer fazer?      │
│                             │
│  + Registrar despesa        │
│  + Registrar receita        │
│  ♡ Quero comprar            │
│  ○ Algo está faltando       │
│                             │
│          Cancelar           │
└─────────────────────────────┘
```

Esta ação deve estar disponível de qualquer área principal do mobile.

---

# 9. Wireframe 07 — Quero comprar

## Objetivo mental

> **Criar uma pausa entre querer e comprar.**

### Mobile

```text
┌─────────────────────────────┐
│ ← Quero comprar             │
│                             │
│ O que você quer comprar?    │
│ [ Tênis__________________ ] │
│                             │
│ Valor                       │
│ [ R$ 300_________________ ] │
│                             │
│ Isso é mais...              │
│ ( ) necessidade             │
│ ( ) desejo                  │
│ ( ) não sei                 │
│                             │
│ Quando você precisa?        │
│ [ Este mês             ▾ ]  │
│                             │
│ Como pretende pagar?        │
│ ( ) à vista                 │
│ ( ) parcelado               │
│                             │
│ [ Analisar compra ]         │
└─────────────────────────────┘
```

### Princípio

Não perguntar dez coisas antes da análise. O app deve conseguir orientar com poucos dados e aprofundar apenas quando necessário.

---

# 10. Wireframe 08 — Resultado da análise de compra

```text
┌─────────────────────────────┐
│ ← Análise                   │
│                             │
│ Tênis                       │
│ R$ 300                      │
│                             │
│ Impacto no seu mês          │
│                             │
│ Disponível hoje             │
│ R$ 512 → R$ 212             │
│                             │
│ Compras pessoais            │
│ R$ 40 restantes             │
│                             │
│ Esta compra usa R$ 260      │
│ além desse orçamento.       │
│                             │
│ O DindIn sugere             │
│ Esperar até outubro         │
│ permite comprar sem usar    │
│ sua reserva.                │
│                             │
│ [ Planejar para outubro ]   │
│ [ Transformar em objetivo ] │
│ [ Comprar mesmo assim ]     │
└─────────────────────────────┘
```

### Compra parcelada

Deve incluir visão temporal:

```text
10x de R$ 60

Você comprometerá:
Out  R$ 60
Nov  R$ 60
Dez  R$ 60
...
Jul  R$ 60

Total: R$ 600
```

Nunca tratar `10x R$60` como se o custo da compra fosse apenas R$60.

---

# 11. Wireframe 09 — Parcelas e compromissos futuros

## Desktop/tablet

```text
┌──────────────┬───────────────────────────────────────────────────────────────┐
│ sidebar      │ Parcelas e compromissos                   [+ Parcela]        │
│              │                                                               │
│              │ Comprometimento mensal futuro                                │
│              │                                                               │
│              │ Set   ███████████████  R$ 460                                 │
│              │ Out   █████████          R$ 270                               │
│              │ Nov   █████████          R$ 270                               │
│              │ Dez   █████████          R$ 270                               │
│              │ Jan   █████████          R$ 270                               │
│              │ Fev   ─                  R$   0                               │
│              │                                                               │
│              │ Parcelas ativas                                               │
│              │ Geladeira   10/10  R$190   termina agora                      │
│              │ CNH          3/7   R$270   restam 4                           │
│              │                                                               │
│              │ [Selecionar → drawer com histórico e impacto]                 │
└──────────────┴───────────────────────────────────────────────────────────────┘
```

### Finalização de parcela

Quando uma parcela chega ao fim, o DindIn deve criar um momento de replanejamento:

```text
Mais espaço no seu mês.

A geladeira terminou.
R$ 190/mês foram liberados.

O que quer fazer com esse valor?

[ Reserva financeira    R$ ___ ]
[ Objetivo              R$ ___ ]
[ Aumentar orçamento    R$ ___ ]
[ Deixar sem destino    R$ ___ ]

[ Confirmar redistribuição ]
```

O caminho visual não deve sugerir uma nova parcela como comportamento padrão.

---

# 12. Wireframe 10 — Fechamento mensal

## Objetivo mental

> **Entender o mês sem julgamento e preparar o próximo.**

```text
┌───────────────────────────────────────────────────────────────┐
│ Setembro acabou                                              │
│                                                               │
│ Entrou                         R$ 2.994                        │
│ Saiu                           R$ 2.482                        │
│ Guardado                       R$   500                        │
│ Disponível final               R$   512                        │
│                                                               │
│ O que funcionou                                                │
│ ✓ Nenhuma nova parcela                                        │
│ ✓ Reserva recebeu R$500                                       │
│                                                               │
│ O que merece atenção                                          │
│ Compras ficou R$330 acima do planejado                        │
│                                                               │
│ O que aprendemos                                              │
│ Itens pessoais apareceram 4 vezes neste mês.                  │
│ Talvez eles precisem de um orçamento próprio.                 │
│                                                               │
│ [ Preparar outubro ]            [ Ver detalhes ]               │
└───────────────────────────────────────────────────────────────┘
```

### Regra

O fechamento não deve parecer um boletim de notas.

O objetivo é:

1. mostrar fatos;
2. destacar padrões;
3. reconhecer evolução;
4. transformar aprendizado em planejamento do próximo mês.

---

# 13. Wireframe 11 — Coisas que estão faltando

Esta funcionalidade é transversal e pode ser acessada pelo botão rápido, Home ou `Quero comprar`.

```text
┌─────────────────────────────────────────────┐
│ Coisas que estão faltando                   │
│                                             │
│ + adicionar                                │
│                                             │
│ Tênis              ~R$ 300   este trimestre│
│ Cabo USB            ~R$  40   sem urgência │
│ Panela              ~R$ 120   este mês     │
│                                             │
│ Padrão percebido                            │
│ Você adicionou 5 itens de uso pessoal       │
│ nos últimos 60 dias.                        │
│                                             │
│ [Criar orçamento para isso]                 │
└─────────────────────────────────────────────┘
```

O sistema não deve presumir que tudo na lista precisa ser comprado.

---

# 14. Wireframe 12 — Objetivos

```text
┌──────────────┬───────────────────────────────────────────────────────────────┐
│ sidebar      │ Objetivos                                    [+ Objetivo]    │
│              │                                                               │
│              │ Reserva inicial                                               │
│              │ R$ 1.200 / R$ 3.000                                           │
│              │ ████████░░░░░░                                                │
│              │ aporte mensal R$500                                           │
│              │ previsão: janeiro                                             │
│              │                                                               │
│              │ Tênis                                                         │
│              │ R$ 100 / R$ 300                                               │
│              │ ████░░░░░░░░                                                │
│              │ aporte mensal R$100                                           │
│              │                                                               │
│              │ [Selecionar → detalhe / editar / pausar]                      │
└──────────────┴───────────────────────────────────────────────────────────────┘
```

Objetivo e orçamento não são a mesma coisa:

- orçamento controla quanto pode ser usado;
- objetivo acumula dinheiro para algo futuro.

---

# 15. Padrões de interação aprovados

## Drawer

Usar para:

- detalhe de orçamento;
- edição de movimentação;
- detalhe de categoria;
- detalhe de parcela;
- explicação de cálculo.

## Modal

Usar para:

- confirmação;
- ação rápida;
- redistribuição simples;
- alertas que exigem decisão imediata.

## Página dedicada

Usar quando a tarefa tem começo, meio e fim próprios:

- Montar meu mês;
- Quero comprar;
- análise de compra;
- fechamento mensal;
- Objetivos;
- Parcelas;
- relatórios futuros.

---

# 16. Prioridade de informação por dispositivo

| Informação/Ação | Mobile | Desktop/Tablet |
|---|---:|---:|
| Disponível para gastar | máxima | máxima |
| Registrar despesa | máxima | alta |
| Registrar receita | alta | média |
| Orçamento restante | alta | alta |
| Fluxo do mês | baixa | alta |
| Comparação histórica | baixa | alta |
| Compromissos futuros | média | alta |
| Quero comprar | máxima | alta |
| Planejamento mensal | média | máxima |
| Fechamento do mês | média | alta |

---

# 17. Critérios para aprovação antes de high-fidelity

Os wireframes serão considerados validados quando conseguirmos responder “sim” para estas perguntas:

1. O usuário sabe quanto realmente pode gastar sem precisar fazer contas?
2. Registrar uma despesa no mobile exige apenas os dados essenciais?
3. O usuário entende a diferença entre saldo, orçamento, reserva e disponível?
4. Uma compra parcelada deixa claro o impacto futuro?
5. Um orçamento estourado leva a uma decisão, e não apenas a um alerta vermelho?
6. Quando uma parcela termina, o sistema incentiva redistribuição consciente?
7. O dashboard permite analisar o mês sem excesso de informação?
8. Desktop e tablet realmente ajudam a planejar, em vez de apenas exibir dados maiores?
9. Mobile realmente favorece ação rápida?
10. Os fluxos podem ser executados sem depender de linguagem contábil?

---

# 18. Próxima etapa

Após a validação destes wireframes, a próxima etapa será o **Design System do DindIn**.

Ele deverá transformar a direção visual aprovada em regras implementáveis para:

- cores;
- tipografia;
- grid;
- espaçamento;
- ícones;
- botões;
- inputs;
- cards;
- tabelas;
- gráficos;
- drawers;
- modais;
- estados e feedback;
- responsividade;
- acessibilidade.

Somente depois disso os wireframes devem evoluir para telas high-fidelity.