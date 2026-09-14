# Migrations iniciais do DindIn

As migrations `0001`–`0003` representam a baseline executável do primeiro vertical slice e foram escritas a partir de `docs/logical-schema.md`.

## Importante

- não editar uma migration já aplicada em ambiente compartilhado;
- qualquer alteração posterior deve criar uma nova migration;
- antes do primeiro deploy real, executar `pnpm install`, `typecheck` e validar as migrations contra um banco Neon de desenvolvimento vazio;
- como esta baseline foi criada antes de um checkout local com Drizzle Kit disponível, o primeiro ciclo de engenharia deve gerar/confirmar os snapshots de metadata do Drizzle antes de usar `drizzle-kit generate` para `M004` em diante;
- o schema TypeScript em `src/schema` é a referência estrutural; os documentos de domínio continuam sendo a referência para regras financeiras.

## Ordem

1. `0001_m001_identity_and_core.sql`
2. `0002_m002_transactions.sql`
3. `0003_m003_planning_and_budgets.sql`

Nenhuma dessas migrations provisiona Neon Auth ou outros schemas de provedores externos.
