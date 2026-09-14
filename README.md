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

Em validação técnica:

- **modelagem de dados e contratos do domínio**.

Decisão de domínio já consolidada:

- **modelo canônico de `Disponível para gastar`**.

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

### Modelagem proposta

A modelagem separa explicitamente:

- dinheiro real movimentado;
- dinheiro planejado;
- compromissos futuros.

Principais entidades propostas:

- perfil;
- contas financeiras;
- categorias;
- transações;
- planejamento mensal;
- definições e períodos de orçamento;
- compromissos recorrentes;
- planos de parcelamento e parcelas;
- objetivos e contribuições;
- intenções de compra e análises;
- itens de necessidade;
- fechamentos mensais;
- auditoria, idempotência e outbox.

Regra de modelagem:

> **Persistir fatos e decisões; calcular projeções e indicadores a partir deles.**

`Disponível para gastar`, orçamento restante, comprometimento futuro e progresso de objetivos são valores derivados e não campos editáveis.

### Disponível para gastar

O DindIn adotará um único cálculo canônico. Ele representa quanto ainda pode ser consumido sem invadir dinheiro protegido nem ignorar compromissos conhecidos.

Princípios já fechados:

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

Antes de gerar migrations, fechar os refinamentos restantes da modelagem e então converter a proposta em schema implementável.

Sequência recomendada:

1. incorporar os refinamentos do modelo canônico ao schema lógico;
2. substituir ajustes opacos por realocações auditáveis de orçamento;
3. fechar entidades, constraints e índices;
4. converter entidades em schemas Drizzle;
5. criar migrations M001–M007;
6. criar schemas Zod;
7. definir contratos OpenAPI;
8. criar fixtures do caso piloto;
9. criar testes das invariantes financeiras;
10. implementar o primeiro vertical slice.

A implementação deverá ocorrer por **vertical slices**, evitando construir banco, API e frontends como projetos isolados.

Ainda permanecem fora do primeiro marco:

- Open Finance;
- integrações bancárias automáticas;
- microserviços;
- infraestrutura Kubernetes;
- monetização.
