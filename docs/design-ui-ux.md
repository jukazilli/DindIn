# DindIn — Direção de Design UI/UX

## 1. Objetivo da experiência

O DindIn é um aplicativo de reeducação financeira. Sua interface deve ajudar o usuário a tomar decisões melhores sem transformar finanças em uma experiência punitiva, fria ou excessivamente técnica.

A experiência deve transmitir simultaneamente:

- clareza;
- controle;
- leveza;
- proximidade;
- energia;
- confiança;
- progresso.

O produto não deve parecer um ERP financeiro, uma planilha, um banco tradicional ou um dashboard genérico de SaaS.

O DindIn deve parecer um produto que está ao lado do usuário enquanto ele aprende a se relacionar melhor com o dinheiro.

> O DindIn não existe para dar bronca porque o usuário gastou. Ele existe para ajudá-lo a entender, decidir e construir novos hábitos.

---

## 2. Princípio central de UX

> **Mobile não é dashboard reduzido. Desktop não é formulário ampliado.**

Cada contexto de uso possui uma tarefa mental principal.

### Mobile

> Registrar → consultar → decidir uma compra.

Prioridades:

- inserção rápida de despesas;
- inserção rápida de receitas;
- consulta ao dinheiro disponível;
- consulta aos orçamentos;
- análise rápida de uma compra;
- últimas movimentações.

### Desktop e tablet

> Observar → entender → planejar → corrigir.

Prioridades:

- dashboard;
- análise do mês;
- orçamentos;
- comparação entre períodos;
- planejamento;
- parcelas e compromissos futuros;
- objetivos;
- saúde financeira.

---

## 3. Direção visual aprovada

A identidade visual aprovada abandona a direção anterior baseada em verde suave e adota uma linguagem mais expressiva, otimista e memorável.

A nova composição usa:

- roxo intenso como cor principal da marca;
- lilás como cor de acolhimento e apoio;
- amarelo ouro como energia e pontuação visual;
- branco e neutros claros como base da interface;
- tipografia display mais pesada e amigável;
- formas arredondadas e elementos gráficos próprios;
- ilustrações estilizadas de objetos financeiros;
- áreas de análise visualmente calmas;
- momentos comportamentais mais expressivos.

### Moodboard oficial aprovado

![Moodboard oficial DindIn](assets/moodboard-dindin.jpg)

### Regra visual central

> **As áreas de análise são calmas. Os momentos de comportamento são expressivos.**

Isso significa que uma tela com muitas transações precisa continuar simples, branca e legível, enquanto um momento como “você liberou R$ 190 por mês” pode receber mais cor, tipografia e personalidade.

---

## 4. Personalidade da marca

O DindIn deve ser percebido como:

- **otimista, mas responsável**;
- **colorido, mas organizado**;
- **divertido, mas adulto**;
- **expressivo, mas funcional**;
- **educativo, mas não professoral**;
- **financeiro, mas não bancário**;
- **amigável, mas não infantil**.

A interface deve evitar culpa e ansiedade financeira sem esconder consequências ou suavizar dados importantes.

---

## 5. Paleta oficial

A identidade do DindIn utiliza cor de forma intencional. O roxo dá personalidade; o lilás acolhe; o amarelo ouro cria energia; o branco preserva clareza.

### 5.1 Cores de marca

| Token | Valor | Uso principal |
|---|---|---|
| `brand.purple` | `#7028F5` | CTA principal, KPI protagonista, marca, navegação ativa |
| `brand.purpleDark` | `#4C16B8` | hover, contraste, áreas especiais e profundidade |
| `brand.lilac` | `#DCC7FF` | fundos especiais, seleção, onboarding, ilustrações |
| `brand.lilacSoft` | `#F3EDFF` | superfícies educativas, estados leves, fundos de apoio |
| `brand.gold` | `#F6C945` | destaques, progresso, insights e elementos da marca |
| `brand.goldSoft` | `#FFF4C7` | feedback positivo e cards de orientação |

### 5.2 Neutros

| Token | Valor | Uso principal |
|---|---|---|
| `surface.white` | `#FFFFFF` | cards, formulários, tabelas e superfícies |
| `surface.canvas` | `#FAF9FC` | fundo geral |
| `text.primary` | `#1C1725` | texto principal e números |
| `text.secondary` | `#716A7D` | legendas e informações auxiliares |
| `border.subtle` | `#E9E5EF` | bordas e divisores discretos |

### 5.3 Proporção visual recomendada

A interface não deve se transformar em uma grande superfície roxa.

Como referência de equilíbrio:

- aproximadamente 70% branco e neutros;
- aproximadamente 15% lilás;
- aproximadamente 10% roxo;
- aproximadamente 5% amarelo ouro.

Esses percentuais são uma orientação de composição, não uma regra matemática rígida.

---

## 6. Cores semânticas

As cores semânticas não devem ser confundidas com as cores de marca.

O amarelo ouro do DindIn, por exemplo, não significa automaticamente “atenção”.

| Estado | Fundo sugerido | Uso |
|---|---|---|
| Sucesso | `#E5F6EA` | meta cumprida, orçamento saudável, receita confirmada |
| Atenção | `#FFF1DA` | aproximação de limite, necessidade de revisão |
| Alerta | `#FCE6EA` | orçamento excedido, uso de verba protegida |
| Informação | `#E9F0FF` | contexto, explicação e orientação |

### Regras

- evitar grandes blocos vermelhos ou amarelos;
- preferir fundos suaves;
- usar cor forte apenas onde a atenção realmente precisa convergir;
- priorizar texto claro sobre alarmismo visual;
- nunca fazer o usuário sentir que toda a tela está em “estado de erro”.

---

## 7. Tipografia oficial

A tipografia será composta por duas famílias com papéis diferentes.

### 7.1 Bricolage Grotesque — identidade e expressão

Uso:

- marca DindIn;
- display;
- H1 e H2;
- mensagens comportamentais;
- KPIs protagonistas;
- chamadas importantes;
- momentos de conquista ou reflexão.

Pesos principais:

- ExtraBold 800;
- Bold 700;
- Medium 500.

A Bricolage Grotesque é responsável pela personalidade visual mais “gordinha”, amigável e memorável.

### 7.2 Manrope — interface e precisão

Uso:

- textos corridos;
- formulários;
- tabelas;
- listas;
- categorias;
- datas;
- descrições;
- menus;
- captions;
- informações de alta densidade.

Pesos principais:

- Bold 700;
- Medium 500;
- Regular 400.

### 7.3 Escala de referência

| Elemento | Fonte | Peso | Desktop |
|---|---|---:|---:|
| Hero | Bricolage Grotesque | 800 | 48–56 px |
| KPI principal | Bricolage Grotesque | 800 | 40–48 px |
| H1 | Bricolage Grotesque | 800 | 32 px |
| H2 | Bricolage Grotesque | 700 | 24 px |
| Card title | Manrope | 700 | 16–18 px |
| Body | Manrope | 400/500 | 15–16 px |
| Caption | Manrope | 500 | 12–14 px |
| Dados e tabelas | Manrope | 500/600 | 14–16 px |

### 7.4 Números financeiros

Para números financeiros, utilizar numerais tabulares quando disponíveis.

Números importantes precisam ser rapidamente escaneáveis e nunca depender apenas de cor para indicar significado.

---

## 8. Hierarquia visual

Cada tela deve possuir **um único protagonista visual**.

### Nível 1 — decisão principal

Na Home, o protagonista é:

> **Disponível para gastar**

Nunca o saldo bancário bruto.

Esse é um dos poucos componentes que pode utilizar roxo intenso como grande superfície.

### Nível 2 — contexto financeiro

Exemplos:

- receitas;
- despesas;
- reservado;
- orçamento restante;
- percentual comprometido.

Normalmente apresentados em superfícies brancas.

### Nível 3 — apoio à decisão

Exemplos:

- orçamentos;
- parcelas;
- compromissos futuros;
- objetivos;
- saúde financeira;
- insights;
- categorias de gasto.

### Regra

Não criar vários cards roxos competindo pela atenção.

---

## 9. Linguagem gráfica própria

A identidade do DindIn deve possuir elementos visuais recorrentes que possam ser reconhecidos mesmo sem o logotipo.

### 9.1 Círculos / moedas

Círculos simples, sobrepostos ou parcialmente cortados podem representar dinheiro, movimento e construção financeira.

Evitar moedas realistas ou visual de banco tradicional.

### 9.2 Cápsulas e formas arredondadas

Grandes formas lilás, roxas ou amarelas podem ser utilizadas em:

- onboarding;
- landing page;
- estados vazios;
- fechamento mensal;
- objetivos;
- conteúdos educativos.

Elas não devem poluir dashboards analíticos.

### 9.3 Faísca DindIn

Três pequenos traços amarelos formam um elemento de marca recorrente.

Usos possíveis:

- conquista;
- valor liberado;
- oportunidade;
- insight;
- detalhe do logotipo;
- feedback positivo.

A faísca deve ser usada com parcimônia para preservar significado.

---

## 10. Ilustrações

A ilustração deve reforçar identidade, não preencher espaço vazio.

### Direção

Preferir objetos financeiros estilizados:

- carteira;
- cartão;
- recibo;
- moeda;
- calendário;
- gráfico;
- etiqueta;
- meta;
- celular.

Características:

- proporções levemente exageradas;
- volumes simples;
- roxo, lilás e amarelo ouro;
- acabamento limpo;
- aparência adulta e contemporânea.

### Evitar

- pessoas genéricas segurando moedas;
- cofrinhos clichês como linguagem principal;
- ilustrações corporativas genéricas;
- personagens infantis;
- excesso de 3D sem função.

---

## 11. Iconografia

A iconografia deve possuir linguagem visual consistente.

Direção:

- traços simples;
- cantos suavemente arredondados;
- alta legibilidade em tamanhos pequenos;
- geometria coerente;
- poucos detalhes internos;
- ícones monocromáticos na maior parte da interface.

A cor do ícone deve seguir hierarquia e estado, não servir como decoração aleatória.

Evitar misturar famílias visuais incompatíveis de ícones.

---

## 12. Home — Desktop e tablet

A Home é um dashboard de análise e planejamento.

Ela deve responder rapidamente:

1. Quanto entrou?
2. Quanto saiu?
3. Quanto realmente posso gastar?
4. Quanto está protegido?
5. Estou dentro do que planejei?
6. O que está comprometendo os próximos meses?
7. O que merece minha atenção agora?

### Estrutura de referência

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Visão geral                                      Setembro 2026      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  DISPONÍVEL          RECEITAS          DESPESAS        RESERVA      │
│  R$ 512              R$ 2.994          R$ 2.482        R$ 500       │
│  [ROXO]              [BRANCO]          [BRANCO]        [BRANCO]     │
│                                                                     │
├───────────────────────────────┬─────────────────────────────────────┤
│ Evolução do mês               │ Seus orçamentos                     │
├───────────────────────────────┼─────────────────────────────────────┤
│ Próximos compromissos         │ Insight / orientação               │
└───────────────────────────────┴─────────────────────────────────────┘
```

### Tarefa mental

> Observar → entender → planejar → corrigir.

---

## 13. Dashboard modular

O dashboard pode utilizar composição modular inspirada em bento-grid, mas sem exagero.

### Diretrizes

- um card protagonista;
- cards secundários predominantemente brancos;
- espaçamento generoso;
- poucas bordas visíveis;
- sombras discretas;
- hierarquia por tamanho e posição;
- evitar fileiras de cards idênticos;
- não preencher espaços apenas por estética.

---

## 14. Cards

Existem três categorias principais de card.

### 14.1 Card protagonista

Exemplo: “Disponível para gastar”.

Características:

- fundo roxo;
- texto branco;
- Bricolage Grotesque nos números principais;
- alta presença visual;
- no máximo um protagonista por contexto.

### 14.2 Card informativo

Exemplos:

- receitas;
- despesas;
- reserva;
- compromissos.

Características:

- fundo branco;
- borda discreta;
- tipografia Manrope;
- cor utilizada apenas em pequenos indicadores.

### 14.3 Card de orientação / insight

Exemplo:

> Um boleto a menos. R$ 190 serão liberados este mês.

Pode utilizar:

- lilás suave;
- amarelo ouro suave;
- pequena ilustração;
- faísca DindIn.

---

## 15. Orçamentos

Orçamento é um dos pilares centrais da experiência.

A interface deve mostrar simultaneamente:

- categoria;
- planejado;
- realizado;
- restante;
- percentual utilizado;
- estado.

Exemplo:

```text
Compras pessoais
R$ 210 de R$ 250
84% utilizado
R$ 40 restantes
```

### Barra de progresso

A barra deve possuir visual discreto e nunca depender exclusivamente de vermelho/verde.

### Excesso de orçamento

Ao ultrapassar um limite, o produto deve mostrar a consequência e oferecer opções.

> Passamos um pouco do combinado.
>
> Compras está R$ 75 acima do planejado.

Ações possíveis:

- ajustar outro orçamento;
- planejar para o próximo mês;
- seguir mesmo assim.

---

## 16. Gráficos

Gráficos são ferramentas de decisão, não decoração.

### Usos aprovados

- entradas x saídas;
- evolução do disponível;
- gastos por categoria;
- progresso de orçamento;
- comprometimento futuro;
- evolução da reserva.

### Regras visuais

- roxo como série principal;
- lilás como comparação secundária;
- amarelo apenas quando precisa destacar algo;
- cores semânticas somente quando houver significado;
- gridlines e eixos discretos;
- tooltip claro;
- legenda simples.

### Evitar

- arco-íris de categorias sem necessidade;
- donuts em excesso;
- gráficos 3D;
- gradientes decorativos;
- informação visual sem pergunta associada.

---

## 17. Detalhes sem perder contexto

No desktop e tablet, preferir drawers e painéis laterais para operações rápidas.

Ao clicar em uma categoria, por exemplo, o usuário pode visualizar:

- transações;
- orçamento;
- valor restante;
- comparação com mês anterior;
- ações de ajuste.

Evitar navegação para uma nova página quando a tarefa puder ser resolvida sem perder o contexto atual.

---

## 18. Comprometimento futuro

Parcelamentos devem ser apresentados como uso de renda futura.

O sistema deve permitir visualizar mês a mês quanto já está comprometido.

Quando uma parcela terminar, o momento deve ganhar personalidade visual.

Exemplo:

> **Um boleto a menos. ✦**
>
> A geladeira terminou e R$ 190 voltam para o seu mês.
>
> Que tal mandar esse valor para sua reserva?

Esse é um exemplo de momento comportamental expressivo.

---

## 19. Saúde financeira

Não utilizar score misterioso como principal mecanismo de orientação.

Preferir indicadores explicáveis:

```text
Reserva mensal                    Boa
Comprometimento da renda          Atenção
Compras não planejadas            Alto
Novas parcelas este mês           Nenhuma
Reserva de emergência             Em construção
```

O usuário deve compreender por que recebeu cada indicação e o que pode fazer para melhorá-la.

---

## 20. Navegação desktop

Sidebar sugerida:

```text
⌂  Visão geral
↕  Movimentações
◎  Orçamentos
▣  Planejamento
▤  Parcelas
⌁  Objetivos
♡  Quero comprar
▥  Relatórios
⚙  Configurações
```

### Estado ativo

- fundo lilás suave;
- ícone e texto roxos;
- sem bloco roxo intenso na sidebar.

---

## 21. Mobile

O mobile prioriza rapidez e decisão.

### Home mobile

Deve mostrar apenas o necessário para responder:

- quanto posso gastar?
- qual é a ação que quero registrar?
- como estão meus principais orçamentos?
- o que aconteceu recentemente?

Exemplo:

```text
Olá!

Disponível para gastar
R$ 512

[ + Despesa ]   [ + Receita ]
[ Quero comprar ] [ Transferir ]

Hoje
Mercado             - R$ 48
Combustível         - R$ 80
Salário          + R$ 2.994
```

---

## 22. Registro rápido no mobile

Registrar uma despesa deve exigir poucos segundos.

Campos essenciais:

- valor;
- descrição;
- categoria;
- forma de pagamento.

Campos secundários devem ficar em “Mais opções”.

### Objetivo

Não transformar a inserção de um gasto em formulário burocrático.

---

## 23. “Quero comprar”

A funcionalidade deve ser tratada como ação de primeira classe.

Exemplo:

```text
Quero comprar
Notebook
R$ 2.500

○ À vista
● 10x R$ 250

[ Analisar compra ]
```

Resultado:

```text
Esta compra compromete R$ 250/mês por 10 meses.

Seu dinheiro livre mensal cairá de:
R$ 702 → R$ 452

Impacto: alto

[ Planejar compra ]
[ Comprar mesmo assim ]
```

A interface informa a consequência sem bloquear a decisão.

---

## 24. Navegação mobile

Sugestão:

```text
Início    Movimentos      +      Planejar      Mais
```

O botão central `+` pode abrir:

- registrar despesa;
- registrar receita;
- quero comprar;
- transferir dinheiro.

---

## 25. Botões

### Primário

- fundo `brand.purple`;
- texto branco;
- alto contraste;
- utilizado para a principal ação do contexto.

### Secundário

- fundo `brand.lilacSoft`;
- texto `brand.purpleDark` ou `brand.purple`.

### Terciário

- texto simples ou outline discreto.

### Regra do amarelo

O amarelo ouro não é o CTA padrão. Ele é um acento visual da marca.

---

## 26. Componentes essenciais

O design system deverá prever pelo menos:

- card de disponível;
- card de métrica;
- card de orçamento;
- linha de transação;
- card de objetivo;
- linha de parcela;
- insight comportamental;
- banner educativo;
- progress bar;
- tag de status;
- tabs;
- filtros;
- seletor de período;
- input monetário;
- quick action;
- drawer;
- modal de confirmação;
- empty state.

Nesta etapa os componentes são definidos conceitualmente; tokens e implementação serão tratados posteriormente.

---

## 27. Espaçamento e densidade

O DindIn deve trabalhar com densidade baixa a média.

Escala base sugerida:

- 4 px;
- 8 px;
- 12 px;
- 16 px;
- 24 px;
- 32 px;
- 48 px;
- 64 px.

### Desktop

Cards principais: padding de 20–28 px.

### Mobile

Cards e formulários: padding de 16–20 px.

A sensação de leveza vem principalmente do espaço em branco, não de componentes excessivamente grandes.

---

## 28. Bordas, raios e sombras

### Bordas

- 1 px;
- `#E9E5EF`;
- somente quando a separação for necessária.

### Raios sugeridos

- controles: 10–12 px;
- cards: 14–18 px;
- cards protagonistas: 16–20 px;
- modais e drawers: 18–24 px.

### Sombras

- suaves;
- baixa opacidade;
- utilizadas principalmente para elevação real.

O layout precisa continuar funcionando se a sombra for removida.

---

## 29. Tom de voz dentro da interface

A comunicação deve ser próxima e humana, mas sempre preservar clareza financeira.

### Evitar

> Orçamento excedido em 15%.

### Preferir

> **Passamos um pouco do combinado.**
>
> Compras está R$ 75 acima do planejado.

### Outro exemplo

Em vez de:

> Parcela finalizada.

Preferir:

> **Mais espaço no seu mês. ✦**
>
> A geladeira terminou e liberou R$ 190 mensais.

A frase amigável nunca deve substituir o dado objetivo; os dois aparecem juntos.

---

## 30. O que deve ser evitado

Para impedir que o DindIn se torne visualmente genérico:

- não utilizar gradiente roxo/azul como solução padrão;
- não usar glassmorphism excessivo;
- não criar dezenas de cards idênticos;
- não usar emojis como sistema de iconografia;
- não usar ilustrações genéricas de bancos de imagem;
- não utilizar cor apenas para “deixar bonito”;
- não usar todos os tons da paleta na mesma tela;
- não transformar dashboards em arco-íris;
- não copiar literalmente referências visuais externas;
- não utilizar tipografia display em tabelas e textos densos;
- não criar componentes sem função clara;
- não usar linguagem punitiva sobre gastos.

---

## 31. Acessibilidade

A identidade visual nunca pode comprometer acessibilidade.

Regras mínimas:

- contraste suficiente para textos e controles;
- informação não pode depender somente de cor;
- áreas clicáveis adequadas ao toque;
- foco de teclado visível no desktop;
- tipografia redimensionável;
- gráficos precisam possuir valores ou descrições equivalentes;
- estados de erro precisam ser explícitos em texto;
- animação não deve ser necessária para compreender uma ação.

---

## 32. Movimento e microinterações

O DindIn pode ser mais animado do que um software financeiro tradicional, porém a animação deve possuir propósito.

Usos aprovados:

- conclusão de registro;
- progresso de meta;
- parcela encerrada;
- dinheiro liberado;
- transição entre estados;
- expansão de detalhes;
- feedback de quick actions.

Evitar:

- animações longas;
- elementos pulando continuamente;
- confete em operações comuns;
- movimento que atrapalhe leitura de números.

---

## 33. Responsividade

### Desktop — referência inicial: 1440 px

- sidebar fixa;
- grid de 2–3 colunas;
- maior capacidade analítica;
- drawers para detalhes.

### Tablet landscape — referência inicial: 1024 px

- experiência analítica preservada;
- grid de 2 colunas;
- sidebar compacta ou adaptativa.

### Tablet portrait

- 1–2 colunas;
- cards reordenados por prioridade;
- nenhuma perda de funcionalidade de planejamento.

### Mobile — referência inicial: 390 px

- uma coluna;
- ações rápidas;
- baixa densidade;
- dashboard resumido;
- inserção como tarefa principal.

---

## 34. Princípios de UI aprovados

1. **Priorizar o valor realmente disponível.**
2. **Uma tela deve possuir um protagonista visual claro.**
3. **Roxo dá personalidade, não deve dominar tudo.**
4. **Lilás acolhe e cria superfícies de apoio.**
5. **Amarelo ouro pontua e energiza.**
6. **Branco preserva análise e legibilidade.**
7. **Mostrar consequências antes da compra.**
8. **Orçamentos precisam estar sempre visíveis e operacionais.**
9. **Parcelas devem ser apresentadas como renda futura comprometida.**
10. **Momentos de reeducação podem ser mais expressivos que telas analíticas.**
11. **Mobile prioriza inserção e decisão rápida.**
12. **Desktop e tablet priorizam análise e planejamento.**
13. **Feedback deve orientar, não julgar.**
14. **Cor e animação precisam possuir função.**
15. **A interface deve ter identidade própria, não aparência de template.**

---

## 35. Síntese da identidade

> **Roxo dá personalidade.**  
> **Lilás dá acolhimento.**  
> **Amarelo dá energia.**  
> **Branco dá clareza.**  
> **Bricolage Grotesque dá voz.**  
> **Manrope organiza os números.**

A direção aprovada deve produzir um DindIn visualmente memorável sem sacrificar a função principal do produto: ajudar pessoas a construir uma relação mais consciente e saudável com o dinheiro.

---

## 36. Status desta documentação

**Status: APROVADO**

Esta direção substitui a proposta visual anterior baseada em verde suave e Manrope como família única.

A partir desta versão, novos wireframes, design system e telas high-fidelity devem seguir esta documentação e o moodboard oficial aprovado.

Ainda não fazem parte desta etapa:

- arquitetura técnica;
- stack de desenvolvimento;
- modelagem de banco;
- integrações bancárias;
- Open Finance;
- backlog de implementação.
