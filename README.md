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

Estrutura atual:

```text
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

- schema Drizzle de perfil;
- contas financeiras;
- categorias;
- transações;
- planejamento mensal;
- definições de orçamento;
- períodos de orçamento;
- realocações auditáveis;
- factory de conexão Neon + Drizzle;
- contratos Zod de dinheiro, perfil, contas, categorias, planejamento, orçamentos e transações;
- package `@dindin/domain` sem dependência de banco/UI;
- motor puro de `Disponível para gastar`;
- fixtures do caso piloto;
- testes das invariantes financeiras centrais.

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

### Motor de domínio validado

O cálculo de `Disponível para gastar` é implementado em `@dindin/domain` e não conhece Drizzle, Neon, Hono, React ou Expo.

Ele calcula e expõe, entre outros valores:

- renda efetiva;
- carry-in total;
- recursos efetivos;
- despesas realizadas;
- saldo protegido restante;
- compromissos conhecidos sem cobertura;
- dinheiro sem destino;
- conflito de planejamento;
- disponível para gastar.

O motor também valida invariantes como:

- renda reconciliada obrigatória em plano reconciliado;
- nenhuma quantia monetária de entrada pode ser negativa;
- capacidade de orçamento não pode ficar negativa após realocações;
- realocações de orçamento precisam fechar em débito/crédito equivalente.

### Caso piloto automatizado

As fixtures automatizam duas leituras importantes do mesmo caso:

```text
Reserva de R$ 500 acumulada de períodos anteriores
→ disponível para gastar = R$ 512

Reserva de R$ 500 criada com a renda do próprio mês
→ disponível para gastar = R$ 12
```

Essa diferença é deliberada e protege a semântica financeira definida no produto.

### CI

Existe um workflow de CI em `.github/workflows/ci.yml`.

A baseline atual foi validada com:

```text
pnpm install
→ typecheck dos 3 packages
→ testes
```

Resultado da validação do domínio em 14/09/2026:

```text
@dindin/contracts  typecheck OK
@dindin/db         typecheck OK
@dindin/domain     typecheck OK

available-to-spend.test.ts
13 testes aprovados
```

A CI usa Node.js 22 e pnpm 10.34.5.

### Validação ainda obrigatória antes do primeiro deploy de banco

A camada TypeScript e os testes puros já passaram pela CI, mas ainda não aplicamos migrations em um banco real.

Antes de qualquer ambiente compartilhado é obrigatório:

1. validar geração/snapshots com Drizzle Kit;
2. aplicar `M001–M003` em um banco Neon de desenvolvimento vazio;
3. executar smoke tests de constraints e foreign keys;
4. comparar o schema gerado com `docs/logical-schema.md`;
5. só então promover migrations para outro ambiente.

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

Com o motor de domínio validado, o próximo bloco é:

1. definir os primeiros contratos OpenAPI;
2. criar o `apps/api` com Hono;
3. implementar adapters entre contratos JSON e o domínio `bigint`;
4. criar endpoints do primeiro vertical slice;
5. integrar repositórios Drizzle somente atrás da camada de aplicação;
6. validar `M001–M003` em Neon de desenvolvimento;
7. executar o primeiro fluxo ponta a ponta.

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
