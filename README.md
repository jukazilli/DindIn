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

- **Telas High-Fidelity**;
- **planejamento técnico de Engenharia, Arquitetura e Infraestrutura**.

### Arquitetura técnica recomendada

A proposta atual utiliza:

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
- PostHog e Sentry para observabilidade.

Princípio de arquitetura:

> **Começar simples como um monólito modular, mas com fronteiras suficientes para crescer sem reescrever o produto.**

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

Antes de iniciar implementação de features, a fundação deve seguir esta sequência:

1. monorepo e tooling;
2. domínio e contratos;
3. banco e migrations;
4. autenticação;
5. API;
6. primeiro vertical slice completo;
7. CI/CD e observabilidade;
8. backup e recuperação.

A implementação deverá ocorrer por **vertical slices**, evitando construir banco, API e frontends como projetos isolados.

Ainda permanecem fora do primeiro marco:

- Open Finance;
- integrações bancárias automáticas;
- microserviços;
- infraestrutura Kubernetes;
- monetização.
