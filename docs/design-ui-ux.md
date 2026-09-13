# DindIn — Direção de Design UI/UX

## 1. Objetivo da experiência

O DindIn deve transmitir calma, clareza e controle.

A interface não deve parecer um ERP financeiro, uma planilha ou um dashboard genérico de SaaS. O produto precisa ter identidade própria e apoiar decisões financeiras sem gerar culpa, ansiedade ou excesso de informação.

O design deve ajudar o usuário a perceber:

- quanto realmente pode gastar;
- onde precisa de atenção;
- como os gastos atuais afetam o futuro;
- quais decisões estão melhorando sua saúde financeira.

---

## 2. Princípio central de UX

> Mobile não é dashboard reduzido. Desktop não é formulário ampliado.

Cada dispositivo terá prioridade diferente.

### Mobile

Tarefa mental principal:

> Registrar → consultar → decidir uma compra.

### Desktop e tablet

Tarefa mental principal:

> Observar → entender → planejar → corrigir.

---

## 3. Direção visual aprovada

O moodboard aprovado define uma direção visual:

- clara;
- calma;
- intencional;
- confiável;
- leve;
- organizada;
- com baixo ruído visual;
- com uso moderado de cor;
- com forte hierarquia tipográfica;
- com componentes modulares e arejados;
- sem aparência de template genérico produzido por IA.

Moodboard oficial:

![Moodboard DindIn](assets/moodboard-dindin.png)

---

## 4. Paleta base

A paleta aprovada utiliza verde suave como cor primária, combinado com neutros frios.

### Primária

- **Primary / 500:** `#84C79A`
- uso: ações principais, destaques positivos, progressos, estado ativo.

### Primária suave

- **Primary / 100:** `#E8F5EB`
- uso: fundos de cards destacados, estados selecionados, feedback leve.

### Fundo

- **Background:** `#FBFCFA`
- uso: plano de fundo geral da aplicação.

### Superfície

- **Surface:** `#FFFFFF`
- uso: cards, painéis, modais e áreas de conteúdo.

### Texto principal

- **Text / Primary:** `#1F2937`

### Texto secundário

- **Text / Secondary:** `#6B7280`

### Bordas

- **Border:** `#E5E7EB`

### Sucesso

- **Success:** `#A7E3B1`

### Atenção

- **Warning:** `#FADCA8`

### Perigo

- **Danger:** `#F8B4B4`

---

## 5. Uso de cores semânticas

Sucesso, atenção e perigo devem ser usados de forma leve.

A cor nunca deve dominar a tela.

Diretrizes:

- usar fundos suaves em vez de blocos saturados;
- evitar grandes áreas vermelhas ou amarelas;
- destacar apenas números, ícones ou microestados quando suficiente;
- reservar cores fortes para ações realmente críticas;
- manter predominância de branco, gelo e neutros.

O objetivo é comunicar estado sem criar ansiedade financeira.

---

## 6. Tipografia

### Fonte escolhida

**Manrope**

Motivos:

- moderna sem parecer excessivamente tecnológica;
- boa legibilidade em interfaces densas;
- numerais claros;
- funciona bem em desktop, tablet e mobile;
- mantém personalidade sem competir com os dados.

### Escala sugerida

#### Display

- 48/56
- peso: SemiBold

#### Heading principal

- 32/40
- peso: SemiBold

#### Heading de seção

- 24/32
- peso: SemiBold

#### Título de card

- 18–20/28
- peso: SemiBold

#### Body

- 16/24
- peso: Regular

#### Small / Caption

- 14/20
- peso: Regular ou Medium

#### Números financeiros principais

- 32–40/40
- peso: SemiBold
- usar números tabulares quando suportado.

---

## 7. Hierarquia visual

A interface deve seguir três níveis claros.

### Nível 1 — KPI principal

O número de maior destaque deve ser:

> **Disponível para gastar**

Nunca o saldo bruto da conta.

### Nível 2 — Métricas secundárias

Exemplos:

- receitas;
- despesas;
- reservado;
- percentual comprometido;
- orçamento restante.

### Nível 3 — Blocos de apoio

Exemplos:

- orçamentos;
- parcelas;
- compromissos futuros;
- metas;
- saúde financeira;
- categorias de gasto.

---

## 8. Home — Desktop e tablet

A Home será um dashboard de análise e planejamento.

Ela deve responder rapidamente:

1. Quanto entrou?
2. Quanto saiu?
3. Quanto realmente posso gastar?
4. Quanto está protegido ou reservado?
5. Estou acima ou abaixo do planejado?
6. Como minhas parcelas afetam os próximos meses?
7. O que merece atenção agora?

### Estrutura sugerida

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Setembro 2026                         + Receita   + Despesa          │
│ Olá                                                           ⚙    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  DISPONÍVEL        RECEITAS        DESPESAS        RESERVADO        │
│  R$ 512            R$ 2.994        R$ 2.482        R$ 500           │
│  até 30/set         este mês        83% da renda    protegido        │
│                                                                     │
├───────────────────────────────┬─────────────────────────────────────┤
│  Fluxo do mês                 │  Para onde foi seu dinheiro         │
│  Entradas x saídas            │  Categorias e participação          │
├───────────────────────────────┼─────────────────────────────────────┤
│  Compromissos futuros         │  Saúde financeira                   │
│  próximos meses               │  alertas e evolução                 │
├───────────────────────────────┴─────────────────────────────────────┤
│  Próximos compromissos / parcelas                                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 9. Dashboard modular

O dashboard pode usar uma composição modular inspirada em bento-grid, sem exagero.

Diretrizes:

- cards com tamanhos diferentes conforme prioridade;
- espaçamento generoso;
- poucas bordas visíveis;
- sombras muito sutis;
- cantos arredondados moderados;
- evitar excesso de cards pequenos;
- nenhum bloco deve competir com o KPI principal.

---

## 10. Gráficos

Gráficos devem ser usados apenas quando ajudam a responder uma pergunta.

### Permitidos

- evolução do saldo disponível;
- entradas x saídas;
- gastos por categoria;
- progresso de orçamento;
- comprometimento futuro;
- evolução da reserva.

### Evitar

- gráficos decorativos;
- excesso de pizza/donut;
- múltiplas cores saturadas;
- visualizações sem contexto ou ação possível.

---

## 11. Orçamentos no dashboard

Orçamentos devem aparecer de forma operacional.

Exemplo:

```text
Orçamento do mês

Planejado           R$ 2.800
Gasto               R$ 2.050
Ainda disponível      R$ 750

██████████████░░░░ 73%
```

Abaixo, mostrar apenas categorias que exigem atenção ou são relevantes.

Exemplo:

```text
Compras pessoais
R$ 210 de R$ 250
84%

Mercado
R$ 280 de R$ 400
70%
```

---

## 12. Detalhes sem perder contexto

No desktop, preferir drawers/painéis laterais para inspeção e edição rápida.

Exemplo:

Ao clicar em “Compras — R$ 1.030”, abrir painel lateral com:

- Shopee;
- Mercado Livre;
- Cartão Caixa;
- orçamento planejado;
- realizado;
- diferença;
- ações de ajuste.

Evitar trocar de página para operações simples.

---

## 13. Comprometimento futuro

O efeito de parcelas deve ser visualmente claro.

Exemplo:

```text
COMPROMETIMENTO FUTURO

Setembro      ███████████████    R$ 1.452
Outubro       █████████████      R$ 1.262
Novembro      █████████████      R$ 1.262
Dezembro      █████████████      R$ 1.262
Janeiro       █████████████      R$ 1.262
Fevereiro     ██████████         R$   992
```

Quando uma parcela terminar:

> R$ 190/mês foram liberados.
>
> Deseja redirecionar esse valor para sua reserva?

---

## 14. Saúde financeira

Não usar score obscuro sem explicação.

Preferir indicadores decomponíveis.

Exemplo:

```text
Saúde financeira

Reserva mensal                    Boa
Comprometimento da renda          Atenção
Compras não planejadas            Alto
Novas parcelas este mês           Nenhuma
Reserva de emergência             Em construção
```

O usuário precisa entender exatamente o que está bom e o que precisa mudar.

---

## 15. Navegação desktop

Sugestão de sidebar:

```text
⌂  Visão geral
↕  Movimentações
◎  Orçamentos
▣  Planejamento
▤  Parcelas
⌁  Objetivos
♡  Quero comprar
⚙  Configurações
```

Regras:

- poucos itens principais;
- ícones simples;
- rótulos claros;
- item ativo destacado com verde suave;
- sidebar sem excesso de contraste.

---

## 16. Mobile

O mobile não deve tentar reproduzir o dashboard completo.

### Home mobile

Prioridades:

- disponível até o próximo salário;
- registrar despesa;
- registrar receita;
- consultar orçamentos;
- últimas movimentações.

Exemplo:

```text
Disponível até o próximo salário

R$ 512

+ Despesa        + Receita

Orçamentos
Mercado              R$ 120 restantes
Compras               R$ 40 restantes
Lazer                 R$ 90 restantes
```

---

## 17. Registro rápido no mobile

Registrar despesa deve levar poucos segundos.

Campos essenciais:

- valor;
- descrição;
- categoria;
- forma de pagamento.

Campos secundários devem ficar em “Mais opções”.

Exemplo:

```text
Quanto você gastou?

R$ _______

Descrição
____________________

Categoria
[ Alimentação ▼ ]

Forma
[ Pix ] [ Cartão ] [ Dinheiro ]

[ Adicionar ]
```

---

## 18. “Quero comprar” no mobile

Deve ser uma ação de primeira classe.

Exemplo:

```text
Quero comprar

Notebook
R$ 2.500

Como pretende pagar?
○ À vista
● 10x R$ 250

[ Analisar compra ]
```

Resultado:

```text
Esta compra comprometerá
R$ 250/mês por 10 meses.

Seu dinheiro livre mensal cairá de
R$ 702 → R$ 452

Impacto: alto

[ Planejar compra ]
[ Comprar mesmo assim ]
```

---

## 19. Navegação mobile

Sugestão:

```text
Hoje     Movimentos      +      Planejar     Perfil
```

O botão central `+` abre:

- Registrar despesa
- Registrar receita
- Quero comprar
- Transferir dinheiro

---

## 20. Componentes principais

### Card de saldo disponível

Deve ser o componente de maior destaque.

### Card de orçamento

Mostrar:

- categoria;
- gasto;
- limite;
- restante;
- barra de progresso.

### Linha de movimentação

Mostrar apenas:

- ícone/categoria;
- descrição;
- data ou horário;
- valor.

### Card de meta

Mostrar:

- objetivo;
- valor atual;
- meta;
- percentual.

### Ação rápida

Botões compactos e claros, sem textos longos.

---

## 21. Linguagem visual

A interface deve parecer:

- organizada, mas não rígida;
- moderna, mas não futurista;
- amigável, mas não infantil;
- financeira, mas não bancária;
- educativa, mas não professoral.

Evitar:

- gradientes genéricos roxo/azul;
- glassmorphism excessivo;
- cards flutuantes sem função;
- emojis como linguagem principal;
- dashboards com dezenas de KPIs;
- ícones aleatórios de bibliotecas sem coerência visual;
- ilustrações genéricas de pessoas segurando moedas;
- visual de template de fintech.

---

## 22. Espaçamento e densidade

O DindIn deve trabalhar com baixa a média densidade.

Sugestão de escala base:

- 4 px
- 8 px
- 12 px
- 16 px
- 24 px
- 32 px
- 48 px

Cards principais devem ter padding entre 20 e 28 px no desktop.

No mobile, entre 16 e 20 px.

---

## 23. Bordas, raio e sombras

### Bordas

- 1 px;
- `#E5E7EB`;
- usar apenas quando necessário para separação.

### Border radius

Sugestão:

- controles: 10–12 px;
- cards: 14–16 px;
- modais/drawers: 16–20 px.

### Sombras

Muito sutis.

O layout deve funcionar mesmo sem sombra.

---

## 24. Estados de feedback

### Sucesso

Confirmar ação sem celebração exagerada.

Exemplo:

> Despesa registrada.

### Atenção

Informar consequência.

Exemplo:

> Você já utilizou 84% do orçamento de compras.

### Perigo

Reservar para situações realmente críticas.

Exemplo:

> Esta compra utiliza dinheiro reservado para despesas obrigatórias.

---

## 25. Princípios de UX aprovados

1. Priorizar o valor realmente disponível.
2. Mostrar consequências antes da compra.
3. Tornar orçamentos visíveis e operacionais.
4. Não incentivar novas parcelas quando antigas terminarem.
5. Não bloquear decisões; informar e orientar.
6. Mobile deve ser rápido para registrar.
7. Desktop e tablet devem favorecer análise.
8. Reduzir ansiedade visual.
9. Usar linguagem financeira acessível.
10. Toda visualização deve responder a uma pergunta real.
11. A interface deve parecer desenhada para o DindIn, não montada a partir de um template genérico.

---

## 26. Critério de qualidade visual

Uma tela do DindIn só deve ser considerada aprovada se:

- a tarefa principal puder ser identificada em poucos segundos;
- o número principal tiver hierarquia inequívoca;
- as cores semânticas não dominarem a interface;
- houver espaço em branco suficiente;
- os gráficos não forem decorativos;
- nenhuma informação crítica depender apenas de cor;
- tablet e desktop preservarem conforto de leitura;
- mobile continuar rápido para registro;
- o design permanecer reconhecível mesmo sem logotipo.

---

## 27. Próxima etapa de design

Após a validação desta documentação, a próxima etapa recomendada é criar:

1. mapa de navegação;
2. user flows principais;
3. wireframes low fidelity;
4. design system inicial;
5. telas high fidelity desktop/tablet;
6. telas high fidelity mobile;
7. protótipo navegável;
8. validação com o caso piloto;
9. ajustes antes de arquitetura e implementação.

Essa sequência existe para evitar que decisões técnicas congelem uma experiência ainda não validada.
