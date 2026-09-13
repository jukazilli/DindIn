# DindIn — Telas High-Fidelity

## 1. Objetivo

Este documento traduz o Design System, os wireframes e os user flows aprovados em especificações visuais finais para as telas prioritárias do DindIn.

Nesta etapa validamos:

- hierarquia real com cores e tipografia;
- densidade de informação;
- comportamento dos componentes;
- uso da identidade visual em contexto;
- equilíbrio entre análise e expressão;
- consistência entre desktop, tablet e mobile.

Princípio central:

> **As áreas de análise são calmas. Os momentos de comportamento são expressivos.**

---

## 2. Ordem de produção

1. Dashboard desktop — 1440 px;
2. Dashboard tablet — 1024 px;
3. Montar meu mês — desktop/tablet;
4. Orçamentos — desktop/tablet;
5. Home mobile — 390 px;
6. Registrar despesa — mobile;
7. Quero comprar — mobile;
8. Resultado da análise de compra;
9. Parcelas / compromissos futuros;
10. Fechamento mensal.

Cada tela só deve avançar para status `aprovada` depois de revisão visual e comportamental.

---

# 3. HF-01 — Dashboard Desktop

## 3.1 Objetivo mental

> **Entender como está o mês, quanto realmente posso gastar e onde preciso agir.**

A tela deve ser útil para análise, não apenas bonita.

## 3.2 Canvas e grid

- viewport de referência: 1440 × 1024 px;
- sidebar: 232–248 px;
- 12 colunas no conteúdo;
- gutter de 24 px;
- margem interna mínima do conteúdo: 32 px;
- fundo geral: `surface.canvas`;
- cards secundários: `surface.primary`.

## 3.3 Sidebar

Itens principais:

- Visão geral;
- Movimentações;
- Orçamentos;
- Planejamento;
- Parcelas;
- Objetivos;
- Quero comprar.

Rodapé da sidebar:

- Configurações;
- avatar/perfil.

### Estado ativo

`Visão geral` deve usar uma cápsula lilás suave, ícone roxo e texto de maior contraste.

A sidebar não deve ser roxa inteira.

## 3.4 Header

Lado esquerdo:

- `Visão geral` em Bricolage Grotesque;
- saudação curta ou contexto do mês, se necessário.

Lado direito:

- seletor `Setembro 2026`;
- botão secundário `+ Receita`;
- CTA `+ Despesa`.

Evitar excesso de ações no header.

## 3.5 Primeira faixa — situação do mês

### Card protagonista — Disponível para gastar

Ocupa aproximadamente 5 colunas.

Conteúdo:

- label: `Disponível para gastar`;
- valor: `R$ 512`;
- contexto: `até o próximo salário`;
- microação: `Entender cálculo`.

Visual:

- fundo `brand.purple.500`;
- texto branco;
- valor em Bricolage Grotesque 800;
- elementos gráficos abstratos discretos, se usados, nunca competindo com o valor;
- sem gráfico decorativo.

### Métricas secundárias

Receitas:

- `R$ 2.994`;
- label `Receitas`;
- superfície branca.

Despesas:

- `R$ 2.482`;
- label `Despesas`;
- superfície branca.

Reserva:

- `R$ 500`;
- label `Protegido` ou `Reserva`;
- superfície branca.

Comprometimento:

- `83% da renda`;
- estado discreto de atenção quando necessário.

Nenhuma métrica secundária deve ter o mesmo peso do card `Disponível`.

## 3.6 Segunda faixa — Orçamentos + Fluxo do mês

### Seus orçamentos

Mostrar somente 3 ou 4 categorias relevantes:

- Compras — 84%;
- Mercado — 70%;
- Lazer — 40%.

Cada linha mostra:

- nome;
- valor usado / limite;
- barra de progresso;
- restante.

Estados semânticos devem ser suaves.

Ação: `Ver todos`.

### Fluxo do mês

Gráfico simples comparando entrada e saída ao longo do período.

Regras:

- máximo de duas séries principais;
- roxo para identidade/dado primário;
- cinza ou lilás discreto para comparação;
- tooltip com valores exatos;
- nenhum arco-íris de categorias.

## 3.7 Terceira faixa — futuro + orientação

### Compromissos futuros

Mostrar 5–6 meses.

Exemplo:

- Set: R$ 1.452;
- Out: R$ 1.262;
- Nov: R$ 1.262;
- Dez: R$ 1.262;
- Jan: R$ 1.262;
- Fev: R$ 992.

Visual recomendado: barras horizontais ou colunas simples.

O objetivo é mostrar quando a renda será liberada, não criar um gráfico complexo.

### Insight comportamental

Card lilás ou ouro suave.

Exemplo:

> **Um boleto a menos. ✦**
> Sua geladeira termina este mês e libera R$ 190/mês.
>
> `Planejar esse valor`

Esse é um momento em que o produto pode ser mais expressivo.

## 3.8 Quarta faixa — Próximos compromissos

Lista compacta:

| Item | Parcela | Valor | Situação |
|---|---:|---:|---|
| Geladeira | 10/10 | R$ 190 | termina este mês |
| CNH | 3/7 | R$ 270 | restam 4 parcelas |

Clicar em uma linha abre drawer, não nova página.

## 3.9 Drawer de detalhe

Usos na Home:

- explicar cálculo do disponível;
- detalhar orçamento;
- detalhar categoria;
- detalhar parcela;
- replanejar.

Largura aproximada desktop: 420–480 px.

O conteúdo da Home permanece visível ao fundo.

## 3.10 Hierarquia final

1. Disponível para gastar;
2. receitas / despesas / reserva / comprometimento;
3. orçamentos e fluxo do mês;
4. futuro e orientação;
5. parcelas e detalhes.

---

# 4. HF-02 — Dashboard Tablet

## Objetivo

Manter capacidade analítica sem simplesmente reduzir o desktop.

Referência: 1024 px.

Mudanças:

- sidebar compacta ou recolhível;
- primeira faixa em duas colunas;
- card `Disponível` continua protagonista;
- métricas secundárias organizadas em grid 2 × 2;
- Orçamentos e Fluxo podem permanecer lado a lado em landscape;
- em portrait, blocos passam para uma coluna sem perder hierarquia;
- drawers ocupam aproximadamente 55–65% da largura.

---

# 5. HF-03 — Montar meu mês

## Objetivo mental

> **Dar função ao dinheiro antes de gastá-lo.**

Estrutura:

- renda prevista no topo;
- resumo `Distribuído / Ainda sem destino`;
- grupos: Obrigações, Consumo, Reservas e Objetivos;
- edição inline simples;
- CTA `Concluir planejamento`;
- indicador de conflito se a distribuição ultrapassar a renda.

Visual:

- fundo claro;
- grupos em superfícies brancas;
- `Ainda sem destino` pode usar lilás suave;
- se negativo, usar estado semântico de atenção/perigo, sem transformar toda a tela em vermelho.

---

# 6. HF-04 — Orçamentos

Desktop/tablet deve priorizar comparação e gerenciamento.

Tabela principal:

- Categoria;
- Planejado;
- Usado;
- Restante;
- Progresso;
- Status.

Recursos:

- filtros por tipo;
- drawer de detalhe;
- edição sem sair da página;
- possibilidade de replanejar;
- indicação de orçamento acumulável.

No tablet portrait, substituir tabela extensa por linhas/cards compactos.

---

# 7. HF-05 — Home Mobile

Objetivo mental:

> **Ver o essencial e registrar algo rapidamente.**

Hierarquia:

1. Disponível até o próximo salário;
2. `+ Despesa` e `+ Receita`;
3. orçamentos que exigem atenção;
4. movimentações recentes;
5. um insight curto.

Não incluir gráficos analíticos extensos.

Bottom navigation:

- Hoje;
- Movimentos;
- botão central `+`;
- Planejar;
- Perfil.

---

# 8. HF-06 — Registrar despesa Mobile

Objetivo: concluir em poucos segundos.

Ordem:

1. valor;
2. descrição;
3. categoria;
4. forma de pagamento;
5. consequência curta;
6. CTA.

`Mais opções` guarda campos secundários.

Exemplo de consequência:

> Mercado: R$ 120 → R$ 72 disponíveis após esta compra.

Se exceder orçamento:

> Esta despesa ultrapassa Mercado em R$ 18.

Ações:

- Replanejar;
- Registrar mesmo assim.

---

# 9. HF-07 — Quero comprar

O fluxo precisa parecer uma ferramenta de decisão, não um formulário burocrático.

Campos mínimos:

- item;
- valor;
- necessidade / desejo / não sei;
- quando precisa;
- à vista / parcelado.

CTA: `Analisar compra`.

Uso de identidade:

- título em Bricolage;
- pequenas formas ou faísca podem aparecer;
- formulário continua majoritariamente branco.

---

# 10. HF-08 — Análise de compra

A tela deve responder três perguntas:

1. Cabe agora?
2. O que muda se eu comprar?
3. Existe uma alternativa melhor?

Estrutura:

- item e valor;
- disponível antes → depois;
- impacto no orçamento relacionado;
- impacto sobre reserva, quando houver;
- se parcelado, impacto mensal + duração;
- recomendação do DindIn;
- alternativas.

Ações possíveis:

- Planejar compra;
- Adicionar à lista;
- Comprar mesmo assim.

O app não deve impedir a decisão.

---

# 11. HF-09 — Parcelas

Desktop/tablet:

- visão de compromissos por mês;
- lista de parcelas;
- término destacado;
- projeção de liberação de renda.

Mobile:

- lista simples;
- valor mensal;
- `X de Y`;
- data final;
- impacto no próximo mês.

Quando uma parcela termina, usar momento comportamental expressivo:

> **Mais espaço no seu mês. ✦**
> R$ 190 foram liberados.

Ação principal: `Planejar esse valor`.

---

# 12. HF-10 — Fechamento mensal

O fechamento não é um relatório punitivo.

Deve responder:

- quanto entrou;
- quanto saiu;
- quanto foi reservado;
- onde ficou acima/abaixo do plano;
- o que melhorou;
- o que levar para o próximo mês.

Estrutura sugerida:

1. resumo financeiro;
2. 2–3 aprendizados;
3. orçamentos que acumularam;
4. parcelas encerradas;
5. proposta inicial para o próximo mês;
6. CTA `Montar próximo mês`.

Aqui a identidade pode ser mais expressiva do que em uma tabela comum.

---

# 13. Estados obrigatórios nas telas high-fidelity

Cada tela deve considerar quando aplicável:

- carregando;
- vazio;
- primeira utilização;
- erro;
- sucesso;
- sem planejamento;
- orçamento estourado;
- renda insuficiente;
- ausência de movimentações;
- ausência de parcelas;
- valores ocultos por privacidade.

---

# 14. Critérios de aprovação visual

Uma tela high-fidelity só é aprovada se:

- a tarefa mental principal estiver evidente;
- houver no máximo um CTA primário por contexto;
- o roxo não dominar áreas analíticas sem necessidade;
- lilás e ouro forem usados como apoio, não decoração excessiva;
- Bricolage não for usada em conteúdo denso;
- números forem fáceis de escanear;
- a tela funcionar sem depender apenas de cor;
- estados de atenção não gerarem sensação de punição;
- desktop e tablet priorizarem análise;
- mobile priorizar ação rápida;
- a aparência for coerente com o moodboard aprovado;
- a tela não parecer um template genérico de fintech ou dashboard de IA.

---

# 15. Status das telas

| ID | Tela | Status |
|---|---|---|
| HF-01 | Dashboard desktop | Em produção |
| HF-02 | Dashboard tablet | Pendente |
| HF-03 | Montar meu mês | Pendente |
| HF-04 | Orçamentos | Pendente |
| HF-05 | Home mobile | Pendente |
| HF-06 | Registrar despesa | Pendente |
| HF-07 | Quero comprar | Pendente |
| HF-08 | Análise de compra | Pendente |
| HF-09 | Parcelas | Pendente |
| HF-10 | Fechamento mensal | Pendente |

O status deve ser atualizado conforme as telas forem revisadas e aprovadas.
