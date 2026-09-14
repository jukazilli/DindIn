import {
  budgetDefinitions,
  budgetPeriods,
  budgetReallocations,
  categories,
  createDb,
  financialAccounts,
  monthlyPlans,
  profiles,
  transactions,
} from "@dindin/db";
import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { createDatabaseApiApp } from "../composition";

const databaseUrl = process.env.DINDIN_INTEGRATION_DATABASE_URL;
const target = process.env.DINDIN_INTEGRATION_TARGET;
const integrationEnabled = Boolean(databaseUrl) && target === "DindIn-dev";

const integrationDescribe = integrationEnabled ? describe : describe.skip;

integrationDescribe("DindIn API + Neon integration", () => {
  it("executes the first vertical slice through Hono and Drizzle", async () => {
    if (!databaseUrl) {
      throw new Error("DINDIN_INTEGRATION_DATABASE_URL is required");
    }

    const userId = crypto.randomUUID();
    const accountId = crypto.randomUUID();
    const categoryId = crypto.randomUUID();
    const monthlyPlanId = crypto.randomUUID();
    const protectedDefinitionId = crypto.randomUUID();
    const protectedPeriodId = crypto.randomUUID();
    const spendableDefinitionId = crypto.randomUUID();
    const spendablePeriodId = crypto.randomUUID();

    const app = createDatabaseApiApp(databaseUrl);
    const db = createDb(databaseUrl);

    const headers = {
      "content-type": "application/json",
      "x-dindin-user-id": userId,
    };

    const post = (path: string, body: unknown) =>
      app.request(path, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

    try {
      expect(
        (
          await post("/v1/profile", {
            name: "DindIn integration test",
          })
        ).status,
      ).toBe(201);

      expect(
        (
          await post("/v1/accounts", {
            id: accountId,
            name: "Conta de integração",
            accountType: "checking",
          })
        ).status,
      ).toBe(201);

      expect(
        (
          await post("/v1/categories", {
            id: categoryId,
            name: "Despesas de integração",
            categoryKind: "expense",
          })
        ).status,
      ).toBe(201);

      expect(
        (
          await post("/v1/monthly-plans", {
            id: monthlyPlanId,
            periodYear: 2026,
            periodMonth: 9,
            expectedIncomeMinor: "299400",
          })
        ).status,
      ).toBe(201);

      expect(
        (
          await post("/v1/budget-definitions", {
            id: protectedDefinitionId,
            name: "Obrigações",
            budgetKind: "obligation",
            spendability: "protected",
            categoryId,
          })
        ).status,
      ).toBe(201);

      expect(
        (
          await post("/v1/budget-periods", {
            id: protectedPeriodId,
            monthlyPlanId,
            budgetDefinitionId: protectedDefinitionId,
            plannedMinor: "145200",
          })
        ).status,
      ).toBe(201);

      expect(
        (
          await post("/v1/budget-definitions", {
            id: spendableDefinitionId,
            name: "Consumo e livre",
            budgetKind: "consumption",
            spendability: "spendable",
            categoryId,
          })
        ).status,
      ).toBe(201);

      expect(
        (
          await post("/v1/budget-periods", {
            id: spendablePeriodId,
            monthlyPlanId,
            budgetDefinitionId: spendableDefinitionId,
            plannedMinor: "154200",
          })
        ).status,
      ).toBe(201);

      expect(
        (
          await post("/v1/transactions", {
            transactionType: "expense",
            amountMinor: "145200",
            categoryId,
            sourceAccountId: accountId,
            budgetPeriodId: protectedPeriodId,
            occurredAt: "2026-09-10T12:00:00.000Z",
            localDate: "2026-09-10",
          })
        ).status,
      ).toBe(201);

      expect(
        (
          await post("/v1/transactions", {
            transactionType: "expense",
            amountMinor: "103000",
            categoryId,
            sourceAccountId: accountId,
            budgetPeriodId: spendablePeriodId,
            occurredAt: "2026-09-12T12:00:00.000Z",
            localDate: "2026-09-12",
          })
        ).status,
      ).toBe(201);

      const response = await app.request(
        `/v1/monthly-plans/${monthlyPlanId}/available-to-spend`,
        { headers: { "x-dindin-user-id": userId } },
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toMatchObject({
        monthlyPlanId,
        currency: "BRL",
        effectiveFundsMinor: "299400",
        postedExpensesMinor: "248200",
        protectedRemainingMinor: "0",
        unassignedMinor: "0",
        availableToSpendMinor: "51200",
        hasPlanningConflict: false,
      });
    } finally {
      // Integration tests own only this randomly generated user. Cleanup is scoped
      // to that exact user id and follows FK dependency order.
      await db.delete(budgetReallocations).where(eq(budgetReallocations.userId, userId));
      await db.delete(transactions).where(eq(transactions.userId, userId));
      await db.delete(budgetPeriods).where(eq(budgetPeriods.userId, userId));
      await db.delete(budgetDefinitions).where(eq(budgetDefinitions.userId, userId));
      await db.delete(monthlyPlans).where(eq(monthlyPlans.userId, userId));
      await db.delete(categories).where(eq(categories.userId, userId));
      await db.delete(financialAccounts).where(eq(financialAccounts.userId, userId));
      await db.delete(profiles).where(eq(profiles.userId, userId));
    }
  });
});
