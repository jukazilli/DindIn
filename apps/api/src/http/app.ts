import {
  CreateBudgetDefinitionSchema,
  CreateBudgetPeriodSchema,
  CreateCategorySchema,
  CreateFinancialAccountSchema,
  CreateMonthlyPlanSchema,
  CreateProfileSchema,
  CreateTransactionSchema,
  UuidSchema,
} from "@dindin/contracts";
import { DomainInvariantError } from "@dindin/domain";
import { Hono, type Context } from "hono";
import { PilotHeaderIdentityProvider } from "../adapters/pilot-header-identity-provider";
import { DindinService } from "../application/dindin-service";
import { ApplicationError } from "../application/errors";
import type { IdentityProvider } from "../ports/identity-provider";
import type { DindinStore } from "../ports/store";
import { openApiDocument } from "./openapi";

type SafeParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: { issues: unknown } };

type SafeParseSchema<T> = {
  safeParse(value: unknown): SafeParseResult<T>;
};

async function requireUserId(c: Context, identityProvider: IdentityProvider): Promise<string> {
  const identity = await identityProvider.resolve(c.req.raw);
  if (!identity) {
    throw new ApplicationError("UNAUTHORIZED", "authentication is required");
  }
  return identity.userId;
}

async function parseJson<T>(c: Context, schema: SafeParseSchema<T>): Promise<T> {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    throw new ApplicationError("VALIDATION_ERROR", "request body must be valid JSON");
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ApplicationError(
      "VALIDATION_ERROR",
      "request validation failed",
      parsed.error.issues,
    );
  }
  return parsed.data;
}

const parseUuidParam = (value: string): string => {
  const parsed = UuidSchema.safeParse(value);
  if (!parsed.success) {
    throw new ApplicationError("VALIDATION_ERROR", "path parameter must be a valid UUID");
  }
  return parsed.data;
};

const toErrorResponse = (
  code:
    | "VALIDATION_ERROR"
    | "UNAUTHORIZED"
    | "NOT_FOUND"
    | "CONFLICT"
    | "DOMAIN_INVARIANT"
    | "INTERNAL_ERROR",
  message: string,
  details?: unknown,
) => ({
  error: {
    code,
    message,
    ...(details === undefined ? {} : { details }),
  },
});

export function createApiApp(
  store: DindinStore,
  identityProvider: IdentityProvider = new PilotHeaderIdentityProvider(),
) {
  const service = new DindinService(store);
  const app = new Hono();

  app.onError((error, c) => {
    if (error instanceof ApplicationError) {
      if (error.code === "VALIDATION_ERROR") {
        return c.json(toErrorResponse(error.code, error.message, error.details), 400);
      }
      if (error.code === "UNAUTHORIZED") {
        return c.json(toErrorResponse(error.code, error.message), 401);
      }
      if (error.code === "NOT_FOUND") {
        return c.json(toErrorResponse(error.code, error.message), 404);
      }
      return c.json(toErrorResponse(error.code, error.message), 409);
    }

    if (error instanceof DomainInvariantError) {
      return c.json(
        toErrorResponse("DOMAIN_INVARIANT", error.message, { domainCode: error.code }),
        400,
      );
    }

    return c.json(toErrorResponse("INTERNAL_ERROR", "unexpected server error"), 500);
  });

  app.get("/health", (c) => c.json({ status: "ok", service: "dindin-api" }, 200));
  app.get("/openapi.json", (c) => c.json(openApiDocument, 200));

  app.get("/v1/me", async (c) => {
    const userId = await requireUserId(c, identityProvider);
    return c.json({ userId }, 200);
  });

  app.post("/v1/profile", async (c) => {
    const userId = await requireUserId(c, identityProvider);
    const input = await parseJson(c, CreateProfileSchema);
    const result = await service.createProfile(userId, input);
    return c.json(result, 201);
  });

  app.post("/v1/accounts", async (c) => {
    const userId = await requireUserId(c, identityProvider);
    const input = await parseJson(c, CreateFinancialAccountSchema);
    const result = await service.createFinancialAccount(userId, input);
    return c.json(result, 201);
  });

  app.post("/v1/categories", async (c) => {
    const userId = await requireUserId(c, identityProvider);
    const input = await parseJson(c, CreateCategorySchema);
    const result = await service.createCategory(userId, input);
    return c.json(result, 201);
  });

  app.post("/v1/monthly-plans", async (c) => {
    const userId = await requireUserId(c, identityProvider);
    const input = await parseJson(c, CreateMonthlyPlanSchema);
    const result = await service.createMonthlyPlan(userId, input);
    return c.json(result, 201);
  });

  app.post("/v1/budget-definitions", async (c) => {
    const userId = await requireUserId(c, identityProvider);
    const input = await parseJson(c, CreateBudgetDefinitionSchema);
    const result = await service.createBudgetDefinition(userId, input);
    return c.json(result, 201);
  });

  app.post("/v1/budget-periods", async (c) => {
    const userId = await requireUserId(c, identityProvider);
    const input = await parseJson(c, CreateBudgetPeriodSchema);
    const result = await service.createBudgetPeriod(userId, input);
    return c.json(result, 201);
  });

  app.post("/v1/transactions", async (c) => {
    const userId = await requireUserId(c, identityProvider);
    const input = await parseJson(c, CreateTransactionSchema);
    const result = await service.createTransaction(userId, input);
    return c.json(result, 201);
  });

  app.get("/v1/monthly-plans/:monthlyPlanId/available-to-spend", async (c) => {
    const userId = await requireUserId(c, identityProvider);
    const monthlyPlanId = parseUuidParam(c.req.param("monthlyPlanId"));
    const result = await service.getAvailableToSpend(userId, monthlyPlanId);
    return c.json(result, 200);
  });

  return app;
}
