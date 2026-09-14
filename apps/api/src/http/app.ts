import {
  ApiErrorSchema,
  AvailableToSpendBreakdownSchema,
  CreateBudgetDefinitionSchema,
  CreateBudgetPeriodSchema,
  CreateCategorySchema,
  CreateFinancialAccountSchema,
  CreateMonthlyPlanSchema,
  CreateProfileSchema,
  CreateTransactionSchema,
  CreatedEntitySchema,
  CreatedProfileSchema,
  HealthResponseSchema,
  UuidSchema,
} from "@dindin/contracts";
import { DomainInvariantError } from "@dindin/domain";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";
import { DindinService } from "../application/dindin-service";
import { ApplicationError } from "../application/errors";
import type { DindinStore } from "../ports/store";

const jsonContent = <T>(schema: T) => ({
  content: {
    "application/json": { schema },
  },
});

const commonErrorResponses = {
  400: {
    ...jsonContent(ApiErrorSchema),
    description: "Invalid request or domain invariant",
  },
  401: {
    ...jsonContent(ApiErrorSchema),
    description: "Missing or invalid authentication context",
  },
  404: {
    ...jsonContent(ApiErrorSchema),
    description: "Resource not found",
  },
  409: {
    ...jsonContent(ApiErrorSchema),
    description: "Resource conflict",
  },
  500: {
    ...jsonContent(ApiErrorSchema),
    description: "Unexpected server error",
  },
} as const;

const secured = [{ PilotUserId: [] }] as const;

const requireUserId = (c: Context): string => {
  const parsed = UuidSchema.safeParse(c.req.header("x-dindin-user-id"));
  if (!parsed.success) {
    throw new ApplicationError(
      "UNAUTHORIZED",
      "x-dindin-user-id must contain a valid user UUID during the pilot",
    );
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

export function createApiApp(store: DindinStore) {
  const service = new DindinService(store);
  const app = new OpenAPIHono({
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json(
          toErrorResponse("VALIDATION_ERROR", "request validation failed", result.error.issues),
          400,
        );
      }
    },
  });

  app.onError((error, c) => {
    if (error instanceof ApplicationError) {
      const status =
        error.code === "UNAUTHORIZED"
          ? 401
          : error.code === "NOT_FOUND"
            ? 404
            : 409;
      return c.json(toErrorResponse(error.code, error.message), status);
    }

    if (error instanceof DomainInvariantError) {
      return c.json(
        toErrorResponse("DOMAIN_INVARIANT", error.message, { domainCode: error.code }),
        400,
      );
    }

    return c.json(toErrorResponse("INTERNAL_ERROR", "unexpected server error"), 500);
  });

  const healthRoute = createRoute({
    method: "get",
    path: "/health",
    responses: {
      200: {
        ...jsonContent(HealthResponseSchema),
        description: "Service health",
      },
    },
  });

  app.openapi(healthRoute, (c) =>
    c.json({ status: "ok" as const, service: "dindin-api" as const }, 200),
  );

  const createProfileRoute = createRoute({
    method: "post",
    path: "/v1/profile",
    security: secured,
    request: {
      body: {
        content: {
          "application/json": { schema: CreateProfileSchema },
        },
      },
    },
    responses: {
      201: {
        ...jsonContent(CreatedProfileSchema),
        description: "Profile created",
      },
      ...commonErrorResponses,
    },
  });

  app.openapi(createProfileRoute, async (c) => {
    const result = await service.createProfile(requireUserId(c), c.req.valid("json"));
    return c.json(result, 201);
  });

  const createAccountRoute = createRoute({
    method: "post",
    path: "/v1/accounts",
    security: secured,
    request: {
      body: { content: { "application/json": { schema: CreateFinancialAccountSchema } } },
    },
    responses: {
      201: { ...jsonContent(CreatedEntitySchema), description: "Financial account created" },
      ...commonErrorResponses,
    },
  });

  app.openapi(createAccountRoute, async (c) => {
    const result = await service.createFinancialAccount(requireUserId(c), c.req.valid("json"));
    return c.json(result, 201);
  });

  const createCategoryRoute = createRoute({
    method: "post",
    path: "/v1/categories",
    security: secured,
    request: {
      body: { content: { "application/json": { schema: CreateCategorySchema } } },
    },
    responses: {
      201: { ...jsonContent(CreatedEntitySchema), description: "Category created" },
      ...commonErrorResponses,
    },
  });

  app.openapi(createCategoryRoute, async (c) => {
    const result = await service.createCategory(requireUserId(c), c.req.valid("json"));
    return c.json(result, 201);
  });

  const createMonthlyPlanRoute = createRoute({
    method: "post",
    path: "/v1/monthly-plans",
    security: secured,
    request: {
      body: { content: { "application/json": { schema: CreateMonthlyPlanSchema } } },
    },
    responses: {
      201: { ...jsonContent(CreatedEntitySchema), description: "Monthly plan created" },
      ...commonErrorResponses,
    },
  });

  app.openapi(createMonthlyPlanRoute, async (c) => {
    const result = await service.createMonthlyPlan(requireUserId(c), c.req.valid("json"));
    return c.json(result, 201);
  });

  const createBudgetDefinitionRoute = createRoute({
    method: "post",
    path: "/v1/budget-definitions",
    security: secured,
    request: {
      body: { content: { "application/json": { schema: CreateBudgetDefinitionSchema } } },
    },
    responses: {
      201: { ...jsonContent(CreatedEntitySchema), description: "Budget definition created" },
      ...commonErrorResponses,
    },
  });

  app.openapi(createBudgetDefinitionRoute, async (c) => {
    const result = await service.createBudgetDefinition(requireUserId(c), c.req.valid("json"));
    return c.json(result, 201);
  });

  const createBudgetPeriodRoute = createRoute({
    method: "post",
    path: "/v1/budget-periods",
    security: secured,
    request: {
      body: { content: { "application/json": { schema: CreateBudgetPeriodSchema } } },
    },
    responses: {
      201: { ...jsonContent(CreatedEntitySchema), description: "Budget period created" },
      ...commonErrorResponses,
    },
  });

  app.openapi(createBudgetPeriodRoute, async (c) => {
    const result = await service.createBudgetPeriod(requireUserId(c), c.req.valid("json"));
    return c.json(result, 201);
  });

  const createTransactionRoute = createRoute({
    method: "post",
    path: "/v1/transactions",
    security: secured,
    request: {
      body: { content: { "application/json": { schema: CreateTransactionSchema } } },
    },
    responses: {
      201: { ...jsonContent(CreatedEntitySchema), description: "Transaction posted" },
      ...commonErrorResponses,
    },
  });

  app.openapi(createTransactionRoute, async (c) => {
    const result = await service.createTransaction(requireUserId(c), c.req.valid("json"));
    return c.json(result, 201);
  });

  const availableToSpendRoute = createRoute({
    method: "get",
    path: "/v1/monthly-plans/{monthlyPlanId}/available-to-spend",
    security: secured,
    request: {
      params: z.object({ monthlyPlanId: UuidSchema }),
    },
    responses: {
      200: {
        ...jsonContent(AvailableToSpendBreakdownSchema),
        description: "Canonical available-to-spend breakdown",
      },
      ...commonErrorResponses,
    },
  });

  app.openapi(availableToSpendRoute, async (c) => {
    const { monthlyPlanId } = c.req.valid("param");
    const result = await service.getAvailableToSpend(requireUserId(c), monthlyPlanId);
    return c.json(result, 200);
  });

  app.doc("/openapi.json", {
    openapi: "3.1.0",
    info: {
      title: "DindIn API",
      version: "0.1.0",
      description: "API do primeiro vertical slice do DindIn.",
    },
    components: {
      securitySchemes: {
        PilotUserId: {
          type: "apiKey",
          in: "header",
          name: "x-dindin-user-id",
          description:
            "Contexto temporário do piloto. Será substituído pelo adapter de autenticação antes de produção.",
        },
      },
    },
  });

  return app;
}
