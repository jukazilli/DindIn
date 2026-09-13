# DindIn — Design System

## 1. Objetivo

Este documento transforma a direção visual, os user flows e os wireframes low-fidelity do DindIn em regras de interface consistentes e implementáveis.

Ele é a fonte de verdade para:

- cores;
- tipografia;
- espaçamento;
- grid;
- formas;
- iconografia;
- componentes;
- estados;
- gráficos;
- overlays;
- responsividade;
- acessibilidade;
- comportamento visual.

O Design System não substitui os fluxos ou os wireframes. Ele define **como as soluções aprovadas devem parecer e se comportar**.

> **As áreas de análise são calmas. Os momentos de comportamento são expressivos.**

---

## 2. Princípios do sistema

### 2.1 Um protagonista por contexto

Cada tela ou bloco deve ter apenas um elemento de maior peso visual.

Na Home, esse elemento é `Disponível para gastar`.

Evitar vários cards roxos, vários números gigantes ou múltiplos CTAs primários competindo entre si.

### 2.2 Cor comunica hierarquia, não decoração

Roxo, lilás e ouro são cores de marca. Elas devem ser utilizadas para orientar atenção, reforçar identidade e marcar momentos relevantes.

A maior parte da interface permanece branca ou neutra.

### 2.3 Informação financeira precisa ser escaneável

Valores, datas, percentuais, categorias e estados devem ser reconhecidos rapidamente.

O usuário nunca deve precisar “decifrar” um card para entender quanto gastou ou quanto ainda pode usar.

### 2.4 O sistema orienta sem punir

Estados negativos não devem transformar a interface em uma tela vermelha.

O padrão é:

> mostrar consequência → explicar → oferecer ação.

### 2.5 Personalidade não pode reduzir legibilidade

Bricolage Grotesque cria voz e personalidade; Manrope organiza a informação.

Não usar a fonte display em tabelas, listas densas ou formulários longos.

---

# 3. Tokens de cor

## 3.1 Marca

| Token | Valor | Uso |
|---|---|---|
| `brand.purple.500` | `#7028F5` | CTA primário, card protagonista, estado ativo, marca |
| `brand.purple.700` | `#4C16B8` | hover, pressed, contraste e superfícies especiais |
| `brand.lilac.300` | `#DCC7FF` | seleção, ilustração, áreas de apoio |
| `brand.lilac.100` | `#F3EDFF` | fundos educativos, cards de orientação, estados leves |
| `brand.gold.500` | `#F6C945` | acentos, progresso, faísca, destaques |
| `brand.gold.100` | `#FFF4C7` | superfícies suaves de conquista ou orientação |

## 3.2 Neutros

| Token | Valor | Uso |
|---|---|---|
| `surface.canvas` | `#FAF9FC` | fundo geral da aplicação |
| `surface.primary` | `#FFFFFF` | cards, tabelas, formulários, modais |
| `text.primary` | `#1C1725` | texto principal e valores |
| `text.secondary` | `#716A7D` | metadados e textos auxiliares |
| `border.subtle` | `#E9E5EF` | divisores e bordas discretas |

## 3.3 Semânticas

As cores semânticas não são intercambiáveis com a paleta de marca.

| Estado | Fundo | Texto/ícone sugerido | Uso |
|---|---|---|---|
| Sucesso | `#E5F6EA` | `#237A46` | meta cumprida, receita confirmada, evolução positiva |
| Atenção | `#FFF1DA` | `#946200` | aproximação de limite, revisão necessária |
| Perigo | `#FCE6EA` | `#A93444` | orçamento excedido, risco ou uso de valor protegido |
| Informação | `#E9F0FF` | `#3866A8` | contexto e explicação |

## 3.4 Proporção visual

Referência de composição:

- 70% branco/neutros;
- 15% lilás;
- 10% roxo;
- 5% amarelo ouro.

Não é uma regra matemática. É uma proteção contra interfaces saturadas.

## 3.5 Combinações aprovadas de contraste

Para textos importantes:

- branco sobre `brand.purple.500`: permitido;
- branco sobre `brand.purple.700`: permitido;
- `text.primary` sobre lilás: preferencial;
- `text.primary` sobre ouro: preferencial;
- branco sobre amarelo ouro: não usar para texto pequeno;
- branco sobre lilás: não usar para conteúdo essencial.

A cor nunca deve ser a única forma de comunicar estado.

---

# 4. Tipografia

## 4.1 Bricolage Grotesque

Responsável por identidade e expressão.

Uso:

- logotipo textual;
- display;
- H1;
- H2;
- KPI protagonista;
- mensagens comportamentais;
- conquistas e reflexões.

Pesos preferenciais:

- 800 ExtraBold;
- 700 Bold;
- 500 Medium.

## 4.2 Manrope

Responsável por interface e leitura funcional.

Uso:

- body;
- formulários;
- menus;
- tabelas;
- listas;
- botões;
- labels;
- captions;
- datas;
- categorias;
- valores em áreas densas.

Pesos preferenciais:

- 700 Bold;
- 600 SemiBold quando disponível;
- 500 Medium;
- 400 Regular.

## 4.3 Escala desktop/tablet

| Token | Fonte | Peso | Tamanho / linha |
|---|---|---:|---:|
| `type.display` | Bricolage | 800 | 56 / 60 |
| `type.hero` | Bricolage | 800 | 48 / 52 |
| `type.kpi` | Bricolage | 800 | 40 / 44 |
| `type.h1` | Bricolage | 800 | 32 / 38 |
| `type.h2` | Bricolage | 700 | 24 / 30 |
| `type.h3` | Manrope | 700 | 18 / 26 |
| `type.bodyLg` | Manrope | 400/500 | 16 / 24 |
| `type.body` | Manrope | 400/500 | 15 / 22 |
| `type.label` | Manrope | 600 | 14 / 20 |
| `type.caption` | Manrope | 500 | 12 / 18 |

## 4.4 Escala mobile

| Token | Fonte | Peso | Tamanho / linha |
|---|---|---:|---:|
| `type.mobileKpi` | Bricolage | 800 | 36 / 40 |
| `type.mobileH1` | Bricolage | 800 | 28 / 34 |
| `type.mobileH2` | Bricolage | 700 | 22 / 28 |
| `type.mobileBody` | Manrope | 400/500 | 15 / 22 |
| `type.mobileLabel` | Manrope | 600 | 14 / 20 |
| `type.mobileCaption` | Manrope | 500 | 12 / 18 |

## 4.5 Valores financeiros

- utilizar numerais tabulares quando possível;
- manter símbolo monetário visualmente próximo do valor;
- alinhar números à direita em tabelas;
- não reduzir valores críticos abaixo de 14 px;
- evitar pesos ultra-light;
- números negativos não dependem apenas de vermelho: usar sinal `−`, texto e contexto.

---

# 5. Espaçamento

Escala base de 4 px.

| Token | Valor |
|---|---:|
| `space.1` | 4 px |
| `space.2` | 8 px |
| `space.3` | 12 px |
| `space.4` | 16 px |
| `space.5` | 20 px |
| `space.6` | 24 px |
| `space.8` | 32 px |
| `space.10` | 40 px |
| `space.12` | 48 px |
| `space.16` | 64 px |

Regras:

- preferir 24–32 px entre blocos principais no desktop;
- usar 16–24 px entre grupos relacionados;
- mobile usa 16 px como padding lateral padrão;
- evitar espaçamentos arbitrários como 13 px, 19 px ou 27 px sem justificativa.

---

# 6. Grid e responsividade

## 6.1 Desktop

Referência: `1440 px`.

- 12 colunas;
- sidebar: aproximadamente 224–248 px;
- gutter: 24 px;
- conteúdo com largura máxima controlada;
- padding externo mínimo: 32 px;
- cards podem ocupar 3, 4, 6, 8 ou 12 colunas conforme prioridade.

## 6.2 Tablet

Referência: `1024 px`.

- 8 colunas como referência;
- sidebar recolhível/compacta;
- gutter: 20–24 px;
- dashboard prioritariamente em 2 colunas;
- manter comportamento analítico enquanto houver espaço suficiente.

## 6.3 Mobile

Referência: `390 px`.

- uma coluna;
- padding lateral: 16 px;
- gap principal: 16 px;
- ações essenciais ao alcance do polegar;
- bottom navigation persistente;
- componentes densos de desktop devem virar cards/listas, não tabelas horizontalmente comprimidas.

## 6.4 Breakpoints de implementação

Referência inicial:

- `mobile`: < 768 px;
- `tablet`: 768–1199 px;
- `desktop`: ≥ 1200 px.

Breakpoints servem ao conteúdo, não ao dispositivo comercial específico.

---

# 7. Formas e elevação

## 7.1 Border radius

| Token | Valor | Uso |
|---|---:|---|
| `radius.sm` | 8 px | chips e controles compactos |
| `radius.md` | 12 px | inputs e botões |
| `radius.lg` | 16 px | cards |
| `radius.xl` | 20 px | modais e drawers especiais |
| `radius.pill` | 999 px | chips e cápsulas |

## 7.2 Bordas

Padrão:

- 1 px;
- `border.subtle`;
- borda apenas quando melhora separação.

## 7.3 Sombras

Sombras devem ser discretas e secundárias à hierarquia.

Níveis:

- `elevation.0`: sem sombra;
- `elevation.1`: card elevado ou hover discreto;
- `elevation.2`: menu, popover, dropdown;
- `elevation.3`: modal ou drawer em destaque.

O layout deve continuar compreensível mesmo com as sombras removidas.

---

# 8. Iconografia

Direção visual:

- traço simples;
- terminais arredondados;
- geometria consistente;
- poucos detalhes internos;
- monocromático na maior parte do produto.

Tamanhos principais:

- 16 px: contexto auxiliar;
- 20 px: controles e linhas;
- 24 px: navegação e ações principais;
- 32 px+: estados vazios ou ilustrações funcionais.

Regras:

- um mesmo conceito deve sempre usar o mesmo ícone;
- não misturar famílias de estilos incompatíveis;
- ícone sem rótulo só quando a ação for universal e inequívoca;
- ações destrutivas exigem texto ou confirmação contextual;
- a faísca DindIn é elemento de marca, não substitui ícone funcional.

---

# 9. Botões

## 9.1 Primário

Uso: ação principal do contexto.

Características:

- fundo `brand.purple.500`;
- texto branco;
- altura desktop: 44–48 px;
- altura mobile: 48–52 px;
- radius 12 px;
- Manrope 600/700.

Estados:

- default: roxo 500;
- hover: roxo 700 ou escurecimento equivalente;
- pressed: feedback visível sem deslocamento exagerado;
- disabled: neutro, contraste reduzido, cursor/estado claro;
- loading: preservar largura e substituir conteúdo por indicador.

## 9.2 Secundário

Uso: alternativa importante sem competir com o CTA.

Características:

- fundo lilás suave;
- texto roxo;
- sem borda pesada.

## 9.3 Terciário

Uso: ações leves ou contextuais.

- transparente;
- texto principal ou roxo;
- hover com fundo neutro/lilás muito suave.

## 9.4 Destrutivo

- não usar vermelho como estilo permanente de navegação;
- utilizar somente quando existe ação realmente destrutiva;
- exigir confirmação quando a consequência não puder ser desfeita.

## 9.5 Icon button

Tamanho mínimo de alvo:

- 40 × 40 px desktop;
- 44 × 44 px mobile.

Tooltip obrigatório no desktop quando o significado não estiver explícito.

---

# 10. Inputs e controles

## 10.1 Input padrão

Anatomia:

1. label;
2. campo;
3. helper text opcional;
4. mensagem de erro quando aplicável.

Altura recomendada: 44–48 px.

Estados:

- default;
- hover;
- focus;
- preenchido;
- disabled;
- error;
- success apenas quando realmente útil.

Focus deve utilizar indicador visível, preferencialmente com roxo e não depender apenas da mudança de borda.

## 10.2 Campo monetário

Priorizar digitação numérica e leitura rápida.

No mobile:

- teclado numérico;
- `R$` persistente;
- valor com destaque superior aos demais campos.

## 10.3 Select

Usar para listas controladas como categoria, período ou forma de pagamento.

Evitar select para escolhas binárias.

## 10.4 Segmented control

Bom uso:

- `À vista / Parcelado`;
- `Todos / Obrigações / Consumo / Reservas` quando houver poucas opções.

## 10.5 Radio

Usar quando todas as opções precisam estar visíveis e apenas uma pode ser selecionada.

## 10.6 Switch

Somente para configurações imediatamente reversíveis.

Exemplo:

`Acumular saldo não utilizado`.

---

# 11. Cards

## 11.1 Card protagonista

Uso principal: `Disponível para gastar`.

- fundo roxo;
- texto branco;
- KPI com Bricolage 800;
- conteúdo reduzido;
- uma ação secundária no máximo;
- apenas um protagonista visual por área.

## 11.2 Card informativo

- superfície branca;
- borda discreta ou sem borda conforme contexto;
- título em Manrope 700;
- números em Manrope 600/700;
- ícones pequenos e funcionais.

## 11.3 Card de insight

- lilás suave ou ouro suave;
- texto curto;
- ação clara;
- pode usar faísca DindIn;
- não deve parecer publicidade.

## 11.4 Card interativo

Se todo o card for clicável:

- hover/focus claro;
- cursor adequado;
- não esconder múltiplas ações conflitantes dentro dele.

---

# 12. KPI e resumo financeiro

Um KPI deve conter, quando aplicável:

1. label curta;
2. valor;
3. período/contexto;
4. comparação opcional;
5. ação opcional.

Exemplo:

```text
Disponível para gastar
R$ 512
até o próximo salário
Entender cálculo
```

Evitar:

- labels vagas como `Saldo` quando o conceito é `Disponível`;
- cinco KPIs com o mesmo peso;
- percentuais sem base de comparação.

---

# 13. Orçamento e progresso

Componente de orçamento deve poder aparecer em card, linha de tabela e resumo mobile.

Informações mínimas:

- categoria;
- utilizado;
- planejado;
- restante;
- estado.

Barra de progresso:

- track neutro;
- preenchimento primário em estado normal;
- estado de atenção/perigo usa semântica suave;
- texto permanece obrigatório.

Exemplo:

```text
Compras
R$ 210 de R$ 250
84% utilizado • R$ 40 restantes
```

Ao exceder:

```text
Compras
R$ 325 de R$ 250
R$ 75 acima do planejado
[Replanejar]
```

---

# 14. Linha de movimentação

Anatomia:

- ícone/categoria;
- descrição;
- data ou horário;
- valor;
- estado opcional.

Desktop pode adicionar conta, forma de pagamento ou orçamento em colunas.

Mobile deve manter apenas o essencial.

Receitas e despesas não dependem somente de verde/vermelho; utilizar `+` e `−` quando necessário.

---

# 15. Tabelas

Tabelas são priorizadas no desktop/tablet para:

- movimentações;
- orçamentos;
- parcelas;
- comparações.

Regras:

- cabeçalho fixo em listas extensas quando útil;
- números alinhados à direita;
- texto à esquerda;
- linha inteira pode ser selecionável;
- hover discreto;
- zebra striping apenas se melhorar leitura, nunca por padrão;
- filtros ficam próximos ao cabeçalho da tabela;
- ações secundárias em menu contextual.

No mobile, tabelas densas devem ser convertidas em linhas/cards verticais.

---

# 16. Chips, badges e estados

## Chips

Uso:

- filtros;
- categorias;
- períodos;
- seleção curta.

## Badges

Uso:

- `Dentro`;
- `Atenção`;
- `Protegido`;
- `Concluído`;
- `Planejado`.

Badge deve complementar o texto, não substituí-lo por cor.

Evitar excesso de badges em uma mesma tela.

---

# 17. Navegação

## 17.1 Sidebar desktop

Itens principais:

- Visão geral;
- Movimentações;
- Orçamentos;
- Planejamento;
- Parcelas;
- Objetivos;
- Quero comprar.

Configurações ficam visualmente separadas da navegação de trabalho.

Estado ativo:

- fundo lilás suave;
- ícone/texto roxo;
- não utilizar grande bloco roxo sólido em todos os itens ativos.

## 17.2 Tablet

Sidebar pode ser compactada para ícones com expansão opcional.

Preservar nomes quando o espaço permitir.

## 17.3 Bottom navigation mobile

Estrutura de referência:

```text
Hoje    Movimentos    [+]    Planejar    Perfil
```

Máximo de cinco destinos/ações visíveis.

O botão central `+` é ação rápida, não uma página permanente.

---

# 18. Drawers, modais e sheets

## 18.1 Drawer desktop

Usar para:

- detalhe de orçamento;
- editar movimentação;
- inspecionar categoria;
- detalhe de parcela;
- pequenos ajustes.

Largura de referência: 400–480 px.

Não usar drawer para tarefas longas ou que exigem comparação com múltiplas áreas simultaneamente.

## 18.2 Modal

Usar para:

- confirmação;
- decisão curta;
- ação irreversível;
- escolha com contexto reduzido.

Evitar modais encadeados.

## 18.3 Bottom sheet mobile

Usar para:

- ação rápida;
- seleção simples;
- opções contextuais;
- confirmação curta.

Fluxos com vários campos devem abrir uma tela dedicada.

---

# 19. Feedback

## 19.1 Toast

Para confirmações transitórias:

- `Despesa registrada.`
- `Orçamento atualizado.`

Toast não pode conter informação crítica que desaparece sem alternativa.

## 19.2 Alerta inline

Para consequência contextual:

> Esta compra usa R$ 260 além do orçamento de compras.

Deve aparecer próximo da decisão correspondente.

## 19.3 Estado vazio

Todo estado vazio deve responder:

1. o que esta área faz;
2. por que ainda está vazia;
3. qual é a próxima ação.

Pode receber linguagem gráfica mais expressiva.

## 19.4 Loading

- preferir skeleton em listas e dashboard;
- preservar estrutura para reduzir deslocamento visual;
- spinner apenas para ações pequenas ou estados locais.

## 19.5 Erro

Mensagem deve explicar:

- o que aconteceu;
- se o dado foi preservado;
- o que o usuário pode fazer agora.

Nunca usar apenas `Erro inesperado` se houver contexto disponível.

---

# 20. Gráficos e visualização de dados

Gráficos devem responder perguntas, não decorar.

Permitidos prioritariamente:

- entradas x saídas;
- evolução do disponível;
- gasto por categoria;
- comprometimento futuro;
- evolução da reserva;
- progresso mensal.

Regras:

- no máximo 4–5 cores relevantes em um mesmo gráfico;
- roxo é série principal por padrão;
- lilás e ouro são séries/acentos secundários;
- semânticas de alerta usam tokens semânticos;
- tooltips mostram valor e contexto;
- eixos e grades discretos;
- evitar 3D;
- evitar donut quando uma barra ou lista responde melhor;
- gráfico nunca substitui valor textual importante.

---

# 21. Linguagem gráfica da marca

Elementos proprietários:

### Círculo/moeda

Representa dinheiro, movimento e construção.

### Cápsula

Usada em onboarding, campanhas, insights e estados especiais.

### Faísca DindIn

Usada para:

- conquista;
- insight;
- oportunidade;
- valor liberado.

Não usar a faísca em alertas negativos.

---

# 22. Ilustrações

Preferir objetos financeiros estilizados em vez de personagens genéricos.

Possíveis elementos:

- carteira;
- recibo;
- cartão;
- etiqueta;
- calendário;
- moeda;
- celular;
- gráfico;
- cofre/caixa quando fizer sentido.

Características:

- formas arredondadas;
- cores da marca;
- proporções levemente exageradas;
- aparência adulta;
- baixo nível de detalhe.

Ilustrações não devem competir com dados financeiros.

---

# 23. Motion e microinterações

Movimento deve explicar causa e efeito.

Usos aprovados:

- atualização suave de barra de orçamento;
- transição de drawer;
- feedback de botão;
- entrada de insight;
- pequena celebração quando uma parcela termina ou uma meta é alcançada.

Regras:

- microinterações: aproximadamente 120–220 ms;
- transições de painel: aproximadamente 200–300 ms;
- evitar bounce exagerado;
- evitar animações contínuas decorativas;
- respeitar `prefers-reduced-motion`.

---

# 24. Acessibilidade

O DindIn deve buscar conformidade WCAG 2.2 AA como referência.

Regras mínimas:

- contraste adequado para texto e controles;
- foco de teclado sempre visível;
- navegação funcional por teclado no desktop;
- labels explícitas em campos;
- mensagens de erro associadas ao campo;
- nenhuma informação depende apenas de cor;
- alvo de toque mínimo próximo de 44 × 44 px no mobile;
- ordem de leitura coerente;
- tooltips não podem conter informação essencial exclusiva;
- gráficos precisam de valores/texto alternativo quando relevantes;
- conteúdo deve permanecer utilizável com zoom de navegador.

Combinações de marca importantes:

- branco sobre roxo principal possui contraste adequado para texto;
- sobre lilás e amarelo, utilizar preferencialmente `text.primary`;
- textos secundários devem ser usados em tamanhos confortáveis, evitando reduzir contraste apenas por estética.

---

# 25. Densidade de informação

Desktop/tablet:

- baixa a média densidade no dashboard;
- média densidade em tabelas e análises;
- priorizar agrupamento e progressive disclosure.

Mobile:

- baixa densidade;
- ações principais visíveis;
- conteúdo secundário revelado sob demanda.

Não criar dashboard com dezenas de pequenos cards para “aproveitar espaço”.

---

# 26. Conteúdo e microcopy

Tom:

- humano;
- direto;
- adulto;
- acolhedor;
- sem julgamento.

Preferir:

> **Passamos um pouco do combinado.**  
> Compras está R$ 75 acima do planejado.

Em vez de:

> ERRO: ORÇAMENTO EXCEDIDO.

Preferir:

> **Mais espaço no seu mês.**  
> A geladeira terminou e liberou R$ 190 mensais.

A linguagem expressiva nunca pode esconder o número ou a consequência.

---

# 27. Componentes prioritários para high-fidelity

A primeira biblioteca visual deve validar, nesta ordem:

1. sidebar desktop;
2. bottom navigation mobile;
3. botão primário/secundário/terciário;
4. input monetário;
5. select;
6. segmented control;
7. card protagonista;
8. card informativo;
9. card de insight;
10. KPI;
11. componente de orçamento;
12. barra de progresso;
13. linha de movimentação;
14. tabela financeira;
15. badge/status;
16. drawer;
17. modal;
18. bottom sheet;
19. toast/alerta inline;
20. componentes básicos de gráfico.

---

# 28. Regras contra aparência genérica

Para preservar identidade própria do DindIn:

- não usar gradientes roxo/azul como recurso padrão;
- não aplicar glassmorphism em dashboards;
- não utilizar uma única biblioteca visual sem customização como identidade final;
- não adicionar ícones coloridos aleatoriamente em cada card;
- não criar 12 cards idênticos na Home;
- não usar ilustrações stock de pessoas com moedas;
- não utilizar Inter como substituição silenciosa das fontes oficiais;
- não transformar todas as superfícies em roxo/lilás;
- não usar gráficos apenas para preencher espaço;
- não reproduzir diretamente a identidade de marcas usadas como referência.

O moodboard orienta linguagem e energia; não deve ser copiado literalmente.

---

# 29. Convenção de tokens

Quando o Design System for convertido para código, utilizar tokens semânticos em vez de valores hexadecimais espalhados pela aplicação.

Exemplo conceitual:

```text
color.brand.primary
color.brand.primaryHover
color.brand.accent
color.surface.canvas
color.surface.card
color.text.primary
color.text.secondary
color.feedback.success
color.feedback.warning
color.feedback.danger

space.1 ... space.16
radius.sm ... radius.xl
type.h1 ... type.caption
```

Componentes devem consumir tokens, não duplicar valores locais sem necessidade.

---

# 30. Critério de aprovação de uma tela

Antes de uma tela high-fidelity ser considerada aprovada, verificar:

- existe um protagonista claro?
- o usuário sabe qual é a próxima ação?
- o `Disponível para gastar` está corretamente diferenciado de saldo bancário?
- orçamento e consequência estão compreensíveis?
- a tela funciona sem depender exclusivamente de cor?
- Bricolage e Manrope estão exercendo papéis corretos?
- roxo, lilás e ouro estão equilibrados?
- a tela respeita o fluxo documentado?
- existe excesso de cards ou informação?
- desktop/tablet continuam analíticos?
- mobile continua rápido para registrar e decidir?
- estados vazio, loading, erro e sucesso foram considerados?
- foco, contraste e tamanho de toque são adequados?

---

# 31. Próxima etapa

Com Briefing, Direção UI/UX, Arquitetura de Informação, User Flows, Wireframes e Design System definidos, a próxima etapa de design é:

> **Telas High-Fidelity**

A ordem recomendada é:

1. Dashboard desktop;
2. Dashboard tablet;
3. Montar meu mês;
4. Orçamentos;
5. Home mobile;
6. Registrar despesa;
7. Quero comprar;
8. análise de compra;
9. Parcelas;
10. Fechamento mensal.

As telas high-fidelity devem validar o sistema visual em uso real antes de qualquer expansão da biblioteca de componentes.