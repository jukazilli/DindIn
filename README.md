# DindIn

DindIn é um app de **reeducação financeira** para pessoas que têm dificuldade em controlar gastos, organizar o dinheiro e construir uma relação mais saudável com suas finanças.

O projeto usa um caso real como piloto: uma pessoa que recebe salário mensal, possui despesas fixas, parcelas e gastos variáveis, mas sente que sempre “falta alguma coisa” e acaba consumindo antes de planejar.

O diferencial do DindIn é atuar também **antes da compra**: mostrar quanto o usuário realmente pode gastar, como uma decisão afeta seus orçamentos e quanto da renda futura já está comprometido.

> **Seu dinheiro mais presente no seu futuro.**

## Documentação atual

- [Briefing do Produto](docs/briefing.md)
- [Design UI/UX](docs/design-ui-ux.md)
- [Mapa de Navegação e Arquitetura de Informação](docs/navigation-map.md)
- [User Flows](docs/user-flows.md)
- [Wireframes Low-Fidelity](docs/wireframes-low-fidelity.md)
- [Design System](docs/design-system.md)
- [Telas High-Fidelity](docs/high-fidelity-screens.md)
- [Engenharia, Arquitetura e Infraestrutura](docs/architecture-engineering-infrastructure.md)
- [Registro de Decisões de Arquitetura](docs/architecture-decisions.md)
- [Modelagem de Dados e Contratos do Domínio](docs/data-model-domain-contracts.md)
- [Modelo Canônico de Disponível para Gastar](docs/available-to-spend-model.md)
- [Schema Lógico, Constraints e Índices](docs/logical-schema.md)
- [Moodboard oficial aprovado](docs/assets/moodboard-dindin.jpg)

## Direção visual aprovada

A identidade do DindIn combina:

- roxo intenso como cor principal;
- lilás como apoio e acolhimento;
- amarelo ouro como acento de energia;
- branco e neutros para preservar clareza;
- **Bricolage Grotesque** para identidade, títulos e momentos expressivos;
- **Manrope** para interface, dados e conteúdos densos.

Princípio visual:

> **As áreas de análise são calmas. Os momentos de comportamento são expressivos.**

## Experiência por dispositivo

**Mobile:** registrar → consultar → decidir uma compra.

**Desktop e tablet:** observar → entender → planejar → corrigir.

## Status

Concluído na definição de produto/design:

- briefing do produto;
- direção de UI/UX;
- moodboard oficial;
- mapa de navegação e arquitetura de informação;
- user flows principais;
- wireframes low-fidelity;
- Design System oficial.

Em andamento no design:

- **Telas High-Fidelity**.

Concluído na fundação técnica:

- arquitetura recomendada;
- engenharia e infraestrutura base;
- seleção inicial de tecnologias;
- registro formal das decisões arquiteturais aceitas;
- modelo canônico de `Disponível para gastar`;
- schema lógico de dados, constraints e índices.

## Implementação técnica iniciada

A implementação começou pelo primeiro vertical slice, sem antecipar features maiores.

Estrutura inicial criada:

```text
packages/
  db/
    src/schema/
    migrations/
  contracts/
    src/
```

Já estão traduzidos para código:

- schema Drizzle de perfil;
- contas financeiras;
- categorias;
- transações;
- planejamento mensal;
- definições de orçamento;
- períodos de orçamento;
- realocações auditáveis;
- factory de conexão Neon + Drizzle;
- contratos Zod de dinheiro, perfil, contas, categorias, planejamento, orçamentos e transações.

Migrations iniciais criadas:

```text
M001 — identity and core
M002 — transactions
M003 — planning and budgets
```

Os valores monetários atravessam contratos JSON como **strings inteiras em centavos** e são convertidos para `bigint` dentro da fronteira de domínio/banco.

Exemplo:

```text
R$ 512,34 → "51234" → bigint(51234)
```

### Validação obrigatória antes do primeiro deploy

Esta baseline foi criada antes de um ambiente local com as dependências do projeto instaladas. Portanto, antes de aplicar as migrations em qualquer ambiente compartilhado é obrigatório:

1. executar `pnpm install`;
2. executar typecheck dos packages;
3. validar o schema com Drizzle Kit;
4. aplicar `M001–M003` em um banco Neon de desenvolvimento vazio;
5. confirmar os snapshots/metadata do Drizzle;
6. executar testes das invariantes financeiras.

Nenhuma migration deve ser aplicada diretamente em produção sem esse ciclo.

### Arquitetura técnica aprovada como baseline

A baseline utiliza:

- TypeScript end-to-end;
- monorepo com pnpm + Turborepo;
- Next.js para Web;
- React Native + Expo para Mobile;
- Hono para API;
- PostgreSQL no Neon;
- Drizzle ORM;
- Neon Auth atrás de uma abstração interna;
- Cloudflare Workers para API;
- Cloudflare R2 para objetos/backups;
- Vercel apenas durante o piloto pessoal/não comercial do Web;
- Expo EAS para builds mobile;
- TanStack Query para estado remoto;
- React Hook Form + Zod para formulários;
- PostHog para analytics com minimização de dados;
- Sentry para erros/crashes;
- GitHub Actions para CI/CD.

Princípio de arquitetura:

> **Começar simples como um monólito modular, mas com fronteiras suficientes para crescer sem reescrever o produto.**

Princípio de infraestrutura:

> **Free-first, não free-forever.**

### Modelagem consolidada

A modelagem separa explicitamente:

- dinheiro real movimentado;
- dinheiro planejado;
- compromissos futuros.

Regra de modelagem:

> **Persistir fatos e decisões; calcular projeções e indicadores a partir deles.**

`Disponível para gastar`, orçamento restante, comprometimento futuro e progresso de objetivos são valores derivados e não campos editáveis.

### Disponível para gastar

O DindIn adotará um único cálculo canônico. Ele representa quanto ainda pode ser consumido sem invadir dinheiro protegido nem ignorar compromissos conhecidos.

Princípios fechados:

- saldo bancário não é disponibilidade;
- limite de cartão não aumenta disponibilidade;
- dinheiro sem destino não é automaticamente livre;
- transferências entre contas próprias são neutras;
- obrigações conhecidas continuam protegidas mesmo se forem esquecidas no orçamento;
- pagamentos de obrigações já protegidas não reduzem o disponível duas vezes;
- resultado negativo é permitido e deve ser explicado;
- `Quero comprar` usa o mesmo motor de cálculo;
- sem planejamento ativo não existe KPI canônico de disponível.

## Próxima etapa técnica

Com Drizzle, `M001–M003` e os contratos Zod iniciais criados, o próximo bloco é:

1. criar o package `domain` com o motor puro de `Disponível para gastar`;
2. criar fixtures do caso piloto;
3. criar testes unitários das invariantes financeiras;
4. definir os primeiros contratos OpenAPI;
5. iniciar a API Hono somente depois dos testes do domínio;
6. montar o primeiro vertical slice ponta a ponta.

Primeiro vertical slice:

```text
perfil
→ conta
→ categoria
→ montar mês
→ orçamento
→ registrar despesa
→ recalcular orçamento
→ recalcular disponível para gastar
→ exibir resultado
```

A implementação continuará por **vertical slices**, evitando construir banco, API e frontends como projetos isolados.

Ainda permanecem fora do primeiro marco:

- Open Finance;
- integrações bancárias automáticas;
- microserviços;
- infraestrutura Kubernetes;
- monetização.
