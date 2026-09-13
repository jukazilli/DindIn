# DindIn — Registro de Decisões de Arquitetura

> Status geral: **decisões aceitas como baseline técnico**  
> Data de referência: **2026-09**

## 1. Objetivo

Este documento registra formalmente as principais decisões técnicas já tomadas para o DindIn.

A documentação `architecture-engineering-infrastructure.md` descreve a arquitetura de forma ampla. Este arquivo existe para responder, de forma objetiva:

- qual decisão foi tomada;
- por que ela foi tomada;
- quais alternativas foram consideradas;
- quais consequências aceitamos;
- em que situação a decisão deve ser revisada.

Uma decisão registrada aqui não deve ser alterada silenciosamente. Mudanças relevantes devem atualizar este documento e explicar o motivo.

---

# ADR-001 — Arquitetura inicial como monólito modular

**Status:** Aceita

## Decisão

O DindIn iniciará como um **monólito modular orientado a domínio**.

Não serão adotados microserviços no primeiro ciclo de desenvolvimento.

## Motivo

O produto ainda está em validação e será mantido inicialmente por uma equipe pequena. Microserviços adicionariam complexidade operacional sem resolver um problema real neste momento.

O monólito modular permite:

- deploy simples;
- transações consistentes;
- debugging mais fácil;
- testes integrados;
- menor custo de infraestrutura;
- separação de responsabilidades por módulo;
- futura extração de serviços quando existir necessidade concreta.

## Alternativas consideradas

- microserviços desde o início;
- BaaS com regras distribuídas entre frontend e funções;
- backend único sem fronteiras de domínio.

## Consequência aceita

Os módulos compartilham processo/deploy da API inicialmente, mas devem manter fronteiras internas claras.

## Revisar quando

- um módulo precisar escalar de forma muito diferente dos demais;
- deploys independentes se tornarem necessários;
- isolamento operacional trouxer benefício mensurável.

---

# ADR-002 — Monorepo

**Status:** Aceita

## Decisão

Usar **pnpm + Turborepo** em um monorepo contendo Web, Mobile, API e packages compartilhados.

## Motivo

O DindIn terá múltiplos clientes consumindo o mesmo domínio e contratos. Um monorepo reduz divergência de versões e facilita refactors coordenados.

## Estrutura-base

```text
apps/
  web/
  mobile/
  api/

packages/
  domain/
  contracts/
  db/
  auth/
  design-tokens/
  analytics/
  config/
  test-utils/
```

## Consequência aceita

Builds precisam ser corretamente isolados para não recompilar tudo sem necessidade.

---

# ADR-003 — TypeScript end-to-end

**Status:** Aceita

## Decisão

TypeScript será a linguagem padrão para Web, Mobile e API.

## Motivo

Permite compartilhar tipos, schemas, validações e domínio entre aplicações, reduzindo inconsistências.

## Consequência aceita

Código financeiro crítico continuará dependendo de testes e invariantes; tipos não substituem validação em runtime.

---

# ADR-004 — API central como autoridade de negócio

**Status:** Aceita

## Decisão

Web e Mobile **não acessarão diretamente o banco de dados para executar regras de negócio**.

Ambos consumirão uma API central.

## Motivo

Regras como:

- disponível para gastar;
- orçamento restante;
- impacto de parcelamento;
- comprometimento futuro;
- fechamento mensal;
- redistribuição de valores;

precisam possuir uma única implementação oficial.

## Consequência aceita

Toda operação de negócio relevante passa por uma chamada de API, mesmo quando a consulta direta ao banco parecer mais simples.

---

# ADR-005 — Next.js para Web

**Status:** Aceita

## Decisão

Usar **Next.js** para a aplicação Web.

## Motivo

O DindIn terá:

- dashboard desktop/tablet;
- landing page;
- páginas públicas futuras;
- necessidade de SEO em conteúdo institucional;
- boa integração com TypeScript e ecossistema React.

## Consequência aceita

Evitar APIs exclusivas de um provedor de hospedagem quando não forem necessárias, preservando portabilidade.

---

# ADR-006 — React Native + Expo para Mobile

**Status:** Aceita

## Decisão

Usar **React Native com Expo** para Android e iOS.

## Motivo

Permite uma base mobile única, boa velocidade de desenvolvimento e integração madura com builds e distribuição.

## Consequência aceita

Recursos nativos específicos poderão exigir módulos Expo/nativos quando surgirem.

---

# ADR-007 — UI não será compartilhada à força

**Status:** Aceita

## Decisão

Compartilhar domínio, contratos, schemas, design tokens e utilitários, mas **não impor uma biblioteca universal de componentes Web/Mobile**.

## Motivo

O produto já definiu:

> Mobile não é dashboard reduzido. Desktop não é formulário ampliado.

Compartilhamento de UI só será feito quando não prejudicar a experiência específica de cada plataforma.

---

# ADR-008 — Hono para API

**Status:** Aceita

## Decisão

Usar **Hono** como framework da API.

## Motivo

- leve;
- bom suporte a TypeScript;
- adequado a runtimes edge/serverless;
- reduz acoplamento a frameworks de backend pesados;
- permite manter a API portável.

## Alternativas consideradas

- NestJS;
- Fastify;
- API Routes/Route Handlers do próprio Next.js como backend principal.

## Consequência aceita

A organização arquitetural precisa ser definida pelo projeto, não pelo framework.

---

# ADR-009 — Zod + OpenAPI para contratos

**Status:** Aceita

## Decisão

Schemas de entrada/saída serão definidos com **Zod**, com documentação/contratos expostos via **OpenAPI**.

## Motivo

Contratos precisam ser explícitos, validáveis em runtime e compartilháveis entre API e clientes.

## Consequência aceita

Não duplicar schemas de formulário e schemas de API sem necessidade; reutilizar quando o significado for o mesmo.

---

# ADR-010 — PostgreSQL como banco relacional

**Status:** Aceita

## Decisão

Usar **PostgreSQL** como banco principal.

## Motivo

O domínio é fortemente relacional e exige:

- integridade;
- constraints;
- transações;
- histórico;
- consultas analíticas;
- relações entre períodos financeiros;
- portabilidade.

## Alternativas consideradas

- bancos NoSQL/documentais;
- armazenamento distribuído por feature.

## Consequência aceita

Modelagem de dados e índices devem ser tratados como parte central da engenharia, não como detalhe do ORM.

---

# ADR-011 — Neon como provedor inicial de PostgreSQL

**Status:** Aceita

## Decisão

Usar **Neon PostgreSQL** no início.

## Motivo

- boa aderência a workload pequeno/intermitente;
- scale-to-zero;
- branching;
- ambientes de preview;
- PostgreSQL padrão;
- caminho simples para crescimento.

## Regra de portabilidade

Lógica de negócio não pode depender de funcionalidades exclusivas do Neon quando houver equivalente PostgreSQL padrão.

## Alternativa válida

Supabase permanece uma alternativa caso a prioridade futura seja consolidar banco, auth, storage e funções em um único fornecedor.

## Revisar quando

- limites comerciais mudarem significativamente;
- requisitos regulatórios exigirem outra região/infraestrutura;
- custo/uso justificar outro PostgreSQL gerenciado.

---

# ADR-012 — Drizzle ORM

**Status:** Aceita

## Decisão

Usar **Drizzle ORM** para schema, migrations e acesso SQL tipado.

## Motivo

Preferência por uma camada leve e próxima de SQL, sem esconder excessivamente o modelo relacional.

## Consequência aceita

Queries complexas podem usar SQL explícito quando isso resultar em solução melhor e mais clara.

---

# ADR-013 — Neon Auth isolado por adapter

**Status:** Aceita

## Decisão

Usar **Neon Auth** inicialmente, sempre atrás de uma abstração interna (`packages/auth`).

## Motivo

Evitar construir autenticação do zero mantendo possibilidade de trocar o provedor no futuro.

## Regra

O domínio não deve conhecer SDKs específicos de autenticação.

## Revisar quando

- requisitos de login social/enterprise superarem o provedor;
- custo ou limites mudarem;
- surgir necessidade de migração de identidade.

---

# ADR-014 — Cloudflare Workers para a API

**Status:** Aceita

## Decisão

Hospedar a API inicialmente em **Cloudflare Workers**.

## Motivo

- baixo custo inicial;
- escala automática;
- distribuição global;
- boa integração com Hono;
- ausência de servidor para administrar.

## Consequência aceita

Dependências precisam ser compatíveis com o runtime escolhido. Bibliotecas que exigirem ambiente Node completo devem ser avaliadas antes de entrar no core.

---

# ADR-015 — Cloudflare R2 para objetos e backups

**Status:** Aceita

## Decisão

Usar **Cloudflare R2** para arquivos de objeto, exports e backups gerenciados pela aplicação.

## Motivo

API compatível com S3, baixo custo e boa portabilidade conceitual.

## Consequência aceita

Arquivos privados devem usar controle de acesso e URLs temporárias quando necessário.

---

# ADR-016 — Vercel apenas no piloto Web

**Status:** Aceita com limitação

## Decisão

Usar **Vercel** para o Web durante piloto pessoal/não comercial pela qualidade da experiência de desenvolvimento.

## Regra

A aplicação não deve assumir Vercel como requisito arquitetural permanente.

Quando o produto entrar em operação comercial, a hospedagem deve ser reavaliada, podendo:

- migrar para infraestrutura Cloudflare;
- contratar plano comercial da Vercel;
- utilizar outro host compatível com Next.js.

---

# ADR-017 — Dinheiro em unidades menores inteiras

**Status:** Aceita

## Decisão

Valores monetários não usarão `float` ou `double`.

Formato padrão:

```text
amount_minor BIGINT
currency CHAR(3)
```

Exemplo:

```text
R$ 512,34 => amount_minor = 51234
currency = BRL
```

## Motivo

Eliminar erros de ponto flutuante em cálculos financeiros.

## Consequência aceita

Formatação para reais/centavos acontece nas fronteiras da aplicação.

---

# ADR-018 — UTC + timezone do usuário

**Status:** Aceita

## Decisão

- timestamps persistidos em UTC;
- perfil registra timezone do usuário;
- mês financeiro deve possuir referência explícita de período local.

## Motivo

Evitar ambiguidades em virada de mês, recorrência, agendamentos e usuários em fusos diferentes.

---

# ADR-019 — UUID e idempotência

**Status:** Aceita

## Decisão

Operações mutáveis importantes terão suporte a **idempotência**, e entidades compatíveis com criação offline/retry poderão receber UUID gerado no cliente.

## Motivo

Preparar a arquitetura para:

- retries de rede;
- duplicidade de requisições;
- experiência mobile instável/offline parcial.

## Consequência aceita

Endpoints de criação devem ser projetados para reconhecer repetição segura da mesma operação.

---

# ADR-020 — Offline parcial, não offline-first completo no MVP

**Status:** Aceita

## Decisão

O MVP não será completamente offline-first, mas a arquitetura não deve impedir registro local e sincronização posterior de ações críticas no Mobile.

## Motivo

Offline completo aumenta significativamente complexidade de conflitos e sincronização. O benefício inicial não justifica esse custo.

## Revisar quando

Dados de uso mostrarem perda relevante de registros por conectividade.

---

# ADR-021 — TanStack Query para estado remoto

**Status:** Aceita

## Decisão

Usar **TanStack Query** para cache, sincronização e invalidação de dados vindos da API.

## Regra

Estado remoto não deve ser duplicado arbitrariamente em stores globais.

---

# ADR-022 — React Hook Form + Zod

**Status:** Aceita

## Decisão

Formulários usarão **React Hook Form + Zod** como padrão.

## Motivo

Boa performance, composição e validação consistente com os contratos do sistema.

---

# ADR-023 — Estado local simples antes de Zustand

**Status:** Aceita

## Decisão

Priorizar estado nativo do React. **Zustand** só será introduzido quando houver estado global cliente real que justifique uma store.

## Alternativa rejeitada no início

Redux como padrão global do projeto.

## Motivo

Evitar infraestrutura de estado antes de existir necessidade.

---

# ADR-024 — Analytics sem dados financeiros sensíveis

**Status:** Aceita

## Decisão

Usar **PostHog** para eventos de produto, mas nunca enviar descrições de transações ou detalhes financeiros sensíveis como propriedades de analytics.

Eventos aceitáveis:

```text
expense_created
budget_created
budget_exceeded
purchase_analyzed
month_closed
```

Dados que não devem ir para analytics:

- descrição livre de compra;
- nome de estabelecimento digitado pelo usuário;
- observações pessoais;
- valores quando não forem estritamente necessários para análise agregada.

## Motivo

Privacidade e minimização de dados.

---

# ADR-025 — Sentry para erros e crashes

**Status:** Aceita

## Decisão

Usar **Sentry** para Web, Mobile e API.

## Regra

Antes de enviar contexto de erro, remover/redigir dados financeiros e informações pessoais desnecessárias.

---

# ADR-026 — GitHub Actions para CI/CD

**Status:** Aceita

## Decisão

Usar **GitHub Actions** para qualidade e automações de CI/CD.

Pipeline mínimo antes de merge:

```text
install
→ lint
→ typecheck
→ unit tests
→ integration tests relevantes
→ build
```

Deploy automático só acontece depois dessas verificações.

---

# ADR-027 — Desenvolvimento por vertical slices

**Status:** Aceita

## Decisão

Features serão implementadas verticalmente, atravessando banco, domínio, API e interface quando necessário.

Exemplo:

```text
Registrar despesa
→ schema/migration
→ regra de domínio
→ endpoint
→ contrato
→ cliente mobile/web
→ testes
→ analytics
```

## Motivo

Evitar meses construindo camadas isoladas que ainda não entregam nenhum fluxo real utilizável.

---

# ADR-028 — Backups independentes do provedor

**Status:** Aceita

## Decisão

Além de recursos de restore do provedor, manter estratégia de backup própria:

```text
PostgreSQL
→ pg_dump periódico
→ criptografia
→ bucket R2 privado
→ teste de restauração
```

## Regra

> **Backup que nunca foi restaurado em teste não deve ser considerado confiável.**

## Motivo

Evitar que disponibilidade do provedor seja confundida com estratégia de recuperação.

---

# ADR-029 — Escalar por evidência, não antecipação

**Status:** Aceita

## Decisão

Não introduzir antecipadamente:

- Kubernetes;
- Kafka;
- Redis obrigatório;
- múltiplos bancos;
- microserviços;
- filas complexas.

Primeiro caminho de escala:

1. otimizar queries e índices;
2. ajustar limites dos serviços atuais;
3. medir gargalos;
4. adicionar cache/fila apenas quando necessário;
5. extrair serviço somente com motivo operacional claro.

---

# ADR-030 — Free-first, não free-forever

**Status:** Aceita

## Decisão

Priorizar serviços com camada gratuita adequada ao piloto e caminho previsível de crescimento.

Isso não significa que a arquitetura deve depender de gratuidade permanente.

## Regra

Os limites, preços e termos de free tiers devem ser **revalidados imediatamente antes do provisionamento**, pois são condições comerciais mutáveis.

## Motivo

O objetivo é validar o produto sem custo prematuro, não comprometer arquitetura para evitar qualquer custo futuro.

---

# ADR-031 — Portabilidade como requisito arquitetural

**Status:** Aceita

## Decisão

Serviços gerenciados podem ser utilizados, mas o núcleo financeiro deve permanecer portável.

Práticas obrigatórias:

- PostgreSQL padrão como fonte de dados;
- domínio independente do provedor;
- Auth atrás de adapter;
- storage compatível com padrão S3 quando possível;
- API própria como fronteira;
- não colocar regras financeiras críticas apenas em triggers/funções proprietárias.

---

# 32. Decisões ainda não fechadas

Os seguintes temas serão definidos nas próximas etapas e **não devem ser tratados como decisão final ainda**:

- schema físico definitivo do banco;
- estratégia exata de soft delete/retention;
- política de versionamento da API;
- mecanismo de jobs/filas assíncronas;
- estrutura de outbox;
- estratégia de sync offline;
- política detalhada de auditoria;
- Open Finance;
- notificações push/e-mail;
- monetização;
- ambientes/regiões definitivas para produção comercial.

---

# 33. Próxima etapa

Com arquitetura, engenharia, infraestrutura e decisões-base formalmente registradas, a próxima etapa é:

> **Modelagem de Dados e Contratos do Domínio.**

Ela deverá transformar os conceitos funcionais em:

- entidades;
- value objects;
- relações;
- cardinalidades;
- invariantes;
- estados;
- eventos de domínio;
- regras de cálculo;
- schemas de persistência;
- contratos de API iniciais.
