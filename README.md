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
- [API do Primeiro Vertical Slice](docs/api-first-vertical-slice.md)
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

## Implementação técnica

O primeiro vertical slice já possui domínio, contratos, persistência e API separados.

Estrutura atual:

```text
apps/
  api/
    src/
      adapters/
      application/
      http/
      ports/
      testing/

packages/
  db/
    src/schema/
    migrations/
  contracts/
    src/
  domain/
    src/planning/
    src/testing/
```

Já estão traduzidos para código:

- schema Drizzle de perfil, contas, categorias, transações e planejamento;
- `M001–M003` para identity/core, transactions e planning/budgets;
- contratos Zod compartilhados;
- valores monetários JSON como strings inteiras em centavos;
- package `@dindin/domain` sem dependência de banco/UI;
- motor puro de `Disponível para gastar`;
- fixtures do caso piloto;
- API Hono do primeiro vertical slice;
- documento OpenAPI 3.1 em `GET /openapi.json`;
- camada de aplicação `DindinService`;
- porta `DindinStore` para persistência;
- `InMemoryDindinStore` para testes;
- `DrizzleDindinStore` para PostgreSQL/Neon;
- composition root `DATABASE_URL → createDb → DrizzleDindinStore → Hono`;
- CI com typecheck e testes.

### Fronteiras atuais

```text
HTTP / Hono
    ↓
Application / DindinService
    ↓
DindinStore
    ↓
Drizzle / PostgreSQL

Application
    ↓
@dindin/domain
    ↓
regras financeiras puras
```

Nenhuma rota HTTP calcula diretamente regras financeiras e o domínio não conhece Neon, Drizzle, Hono, React ou Expo.

### Dinheiro

Valores monetários atravessam contratos JSON como **strings inteiras em centavos** e são convertidos para `bigint` dentro da fronteira da aplicação/domínio.

```text
R$ 512,34 → "51234" → bigint(51234)
```

### Migrations iniciais

```text
M001 — identity and core
M002 — transactions
M003 — planning and budgets
```

Essas migrations existem no repositório, mas **ainda não foram aplicadas/validadas em um banco Neon real do DindIn**.

### Motor de domínio validado

O motor calcula:

- renda efetiva;
- carry-in total;
- recursos efetivos;
- despesas realizadas;
- saldo protegido restante;
- compromissos conhecidos sem cobertura;
- dinheiro sem destino;
- conflito de planejamento;
- disponível para gastar.

Ele também valida invariantes como renda reconciliada obrigatória, valores não negativos, capacidade de orçamento e equilíbrio das realocações.

### Caso piloto automatizado

```text
Reserva de R$ 500 acumulada de períodos anteriores
→ disponível para gastar = R$ 512

Reserva de R$ 500 criada com a renda do próprio mês
→ disponível para gastar = R$ 12
```

O primeiro fluxo HTTP automatizado também percorre:

```text
perfil
→ conta
→ categoria
→ montar mês
→ orçamento protegido/gastável
→ registrar despesas
→ consultar disponível para gastar
```

Com renda de R$ 2.994 e despesas realizadas de R$ 2.482, o endpoint retorna **R$ 512 disponíveis**.

### API atual

```text
GET  /health
GET  /openapi.json
POST /v1/profile
POST /v1/accounts
POST /v1/categories
POST /v1/monthly-plans
POST /v1/budget-definitions
POST /v1/budget-periods
POST /v1/transactions
GET  /v1/monthly-plans/{monthlyPlanId}/available-to-spend
```

Durante o piloto técnico, as rotas protegidas usam temporariamente:

```text
x-dindin-user-id: <UUID>
```

Esse header **não é autenticação de produção** e deverá ser substituído pelo adapter de Auth antes de qualquer beta com usuários externos.

### CI

A baseline atual foi validada em 14/09/2026 com:

```text
pnpm install
pnpm typecheck
pnpm test
```

Resultado:

```text
@dindin/contracts  typecheck OK
@dindin/db         typecheck OK
@dindin/domain     typecheck OK
@dindin/api        typecheck OK

Domain: 13 testes aprovados
API:     3 testes HTTP aprovados
```

A CI usa Node.js 22 e pnpm 10.34.5.

## Arquitetura técnica aprovada como baseline

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

## Modelagem consolidada

A modelagem separa explicitamente:

- dinheiro real movimentado;
- dinheiro planejado;
- compromissos futuros.

> **Persistir fatos e decisões; calcular projeções e indicadores a partir deles.**

`Disponível para gastar`, orçamento restante, comprometimento futuro e progresso de objetivos são valores derivados e não campos editáveis.

### Disponível para gastar

O DindIn adota um único cálculo canônico. Ele representa quanto ainda pode ser consumido sem invadir dinheiro protegido nem ignorar compromissos conhecidos.

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

A próxima fronteira é externa ao código: **validar o primeiro vertical slice em um PostgreSQL/Neon real e isolado do DindIn**.

Sequência planejada:

1. provisionar um projeto/ambiente Neon exclusivo de desenvolvimento para o DindIn;
2. obter a conexão somente no ambiente seguro, sem versionar credenciais;
3. validar geração/snapshots com Drizzle Kit;
4. aplicar `M001–M003` em banco vazio;
5. executar smoke tests de CHECKs, FKs, UNIQUEs e ownership;
6. executar o mesmo fluxo HTTP usando `DrizzleDindinStore`;
7. comparar o resultado com o adapter em memória;
8. registrar a validação das migrations;
9. depois conectar o adapter de autenticação e preparar o primeiro deploy dev em Cloudflare Workers.

No momento **não existe um projeto Neon chamado DindIn** entre os projetos conectados. Nenhum projeto existente de outro produto será reutilizado.

Ainda permanecem fora do primeiro marco:

- Open Finance;
- integrações bancárias automáticas;
- microserviços;
- infraestrutura Kubernetes;
- monetização.
