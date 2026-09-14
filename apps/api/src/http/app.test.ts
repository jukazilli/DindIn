import { describe, expect, it } from "vitest";
import { InMemoryDindinStore } from "../testing/in-memory-store";
import { createApiApp } from "./app";

const userId = "11111111-1111-4111-8111-111111111111";
const accountId = "22222222-2222-4222-8222-222222222222";
const categoryId = "33333333-3333-4333-8333-333333333333";
const monthlyPlanId = "44444444-4444-4444-8444-444444444444";
const protectedDefinitionId = "55555555-5555-4555-8555-555555555555";
const protectedPeriodId = "66666666-6666-4666-8666-666666666666";
const spendableDefinitionId = "77777777-7777-4777-8777-777777777777";
const spendablePeriodId = "88888888-8888-4888-8888-888888888888";

const headers = {
  "content-type": "application/json",
  "x-dindin-user-id": userId,
};

const post = (app: ReturnType<typeof createApiApp>, path: string, body: unknown) =>
  app.request(path, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

async function seedPilotMonth(app: ReturnType<typeof createApiApp>) {
  expect(
    (
      await post(app, "/v1/profile", {
        name: "Piloto DindIn",
      })
    ).status,
  ).toBe(201);

  expect(
    (
      await post(app, "/v1/accounts", {
        id: accountId,
        name: "Conta principal",
        accountType: "checking",
      })
    ).status,
  ).toBe(201);

  expect(
    (
      await post(app, "/v1/categories", {
        id: categoryId,
        name: "Despesas gerais",
        categoryKind: "expense",
      })
    ).status,
  ).toBe(201);

  expect(
    (
      await post(app, "/v1/monthly-plans", {
        id: monthlyPlanId,
        periodYear: 2026,
        periodMonth: 9,
        expectedIncomeMinor: "299400",
      })
    ).status,
  ).toBe(201);

  expect(
    (
      await post(app, "/v1/budget-definitions", {
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
      await post(app, "/v1/budget-periods", {
        id: protectedPeriodId,
        monthlyPlanId,
        budgetDefinitionId: protectedDefinitionId,
        plannedMinor: "145200",
      })
    ).status,
  ).toBe(201);

  expect(
    (
      await post(app, "/v1/budget-definitions", {
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
      await post(app, "/v1/budget-periods", {
        id: spendablePeriodId,
        monthlyPlanId,
        budgetDefinitionId: spendableDefinitionId,
        plannedMinor: "154200",
      })
    ).status,
  ).toBe(201);

  expect(
    (
      await post(app, "/v1/transactions", {
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
      await post(app, "/v1/transactions", {
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
}

describe("DindIn API", () => {
  it("executes the first vertical slice and returns R$ 512 available", async () => {
    const app = createApiApp(new InMemoryDindinStore());
    await seedPilotMonth(app);

    const response = await app.request(
      `/v1/monthly-plans/${monthlyPlanId}/available-to-spend`,
      { headers: { "x-dindin-user-id": userId } },
    );

    expect(response.status).toBe(200);
    const body = await response.json();

    expect(body).toMatchObject({
      monthlyPlanId,
      currency: "BRL",
      effectiveFundsMinor: "299400",
      postedExpensesMinor: "248200",
      protectedRemainingMinor: "0",
      unassignedMinor: "0",
      availableToSpendMinor: "51200",
      hasPlanningConflict: false,
    });
  });

  it("publishes an OpenAPI document with the canonical calculation endpoint", async () => {
    const app = createApiApp(new InMemoryDindinStore());
    const response = await app.request("/openapi.json");

    expect(response.status).toBe(200);
    const document = await response.json();
    expect(document.openapi).toBe("3.1.0");
    expect(document.paths).toHaveProperty(
      "/v1/monthly-plans/{monthlyPlanId}/available-to-spend",
    );
    expect(document.components.securitySchemes).toHaveProperty("PilotUserId");
  });

  it("rejects secured routes without the pilot authentication context", async () => {
    const app = createApiApp(new InMemoryDindinStore());
    const response = await app.request("/v1/monthly-plans", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        periodYear: 2026,
        periodMonth: 9,
        expectedIncomeMinor: "299400",
      }),
    });

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({
      error: { code: "UNAUTHORIZED" },
    });
  });
});
