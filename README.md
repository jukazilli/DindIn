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

Em andamento:

- **Telas High-Fidelity**.

Concluído na fundação técnica:

- arquitetura recomendada;
- engenharia e infraestrutura base;
- seleção inicial de tecnologias;
- registro formal das decisões arquiteturais aceitas.

### Arquitetura técnica aprovada como baseline

A baseline atual utiliza:

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

O piloto deve priorizar serviços gratuitos e escaláveis, mas limites e termos comerciais serão revalidados no momento do provisionamento. A arquitetura não deve depender de gratuidade permanente.

### Decisões técnicas formalizadas

O registro de decisões documenta, entre outros pontos:

- monólito modular;
- monorepo;
- API central como autoridade do domínio;
- PostgreSQL/Neon;
- Hono + Cloudflare Workers;
- Expo para Mobile;
- portabilidade entre provedores;
- dinheiro em unidades menores inteiras;
- UTC + timezone do usuário;
- idempotência e preparação para offline parcial;
- analytics sem dados financeiros sensíveis;
- backup independente do provedor;
- desenvolvimento por vertical slices;
- escala por evidência, sem microserviços prematuros.

### Design System definido

O sistema documenta:

- tokens de cor;
- tipografia;
- espaçamento;
- grids e breakpoints;
- border radius e elevação;
- iconografia;
- botões e controles;
- cards e KPIs;
- orçamentos e barras de progresso;
- movimentações e tabelas;
- navegação desktop/tablet/mobile;
- drawers, modais e bottom sheets;
- feedbacks e estados;
- gráficos;
- motion;
- acessibilidade;
- microcopy;
- convenção de tokens para futura implementação.

## Ordem das telas High-Fidelity

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

## Próxima etapa técnica

A próxima etapa é **Modelagem de Dados e Contratos do Domínio**.

Ela deve definir, antes da implementação:

1. entidades e value objects;
2. relações e cardinalidades;
3. invariantes financeiras;
4. estados e ciclos de vida;
5. eventos de domínio;
6. regras de cálculo;
7. schema lógico/físico inicial;
8. índices e constraints;
9. contratos iniciais da API;
10. estratégia de migrations e seeds.

Somente depois dessa modelagem a fundação de código deve avançar para banco e domínio.

A implementação deverá ocorrer por **vertical slices**, evitando construir banco, API e frontends como projetos isolados.

Ainda permanecem fora do primeiro marco:

- Open Finance;
- integrações bancárias automáticas;
- microserviços;
- infraestrutura Kubernetes;
- monetização.
