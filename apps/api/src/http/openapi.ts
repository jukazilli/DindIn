const moneyMinor = {
  type: "string",
  pattern: "^\\d+$",
  description: "Integer amount in minor currency units. Example: R$ 512,34 = 51234.",
} as const;

const signedMoneyMinor = {
  type: "string",
  pattern: "^-?\\d+$",
} as const;

const uuid = { type: "string", format: "uuid" } as const;
const secured = [{ NeonAuthBearer: [] }, { PilotUserId: [] }];

export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "DindIn API",
    version: "0.1.0",
    description:
      "API do primeiro vertical slice do DindIn. Valores monetários trafegam como strings inteiras em centavos.",
  },
  paths: {
    "/health": {
      get: {
        operationId: "health",
        responses: {
          "200": {
            description: "Service health",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },
    "/v1/profile": {
      post: {
        operationId: "createProfile",
        security: secured,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CreateProfile" } },
          },
        },
        responses: {
          "201": {
            description: "Profile created",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/CreatedProfile" } },
            },
          },
          default: { $ref: "#/components/responses/Error" },
        },
      },
    },
    "/v1/accounts": {
      post: {
        operationId: "createFinancialAccount",
        security: secured,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CreateFinancialAccount" } },
          },
        },
        responses: {
          "201": { $ref: "#/components/responses/CreatedEntity" },
          default: { $ref: "#/components/responses/Error" },
        },
      },
    },
    "/v1/categories": {
      post: {
        operationId: "createCategory",
        security: secured,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CreateCategory" } },
          },
        },
        responses: {
          "201": { $ref: "#/components/responses/CreatedEntity" },
          default: { $ref: "#/components/responses/Error" },
        },
      },
    },
    "/v1/monthly-plans": {
      post: {
        operationId: "createMonthlyPlan",
        security: secured,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CreateMonthlyPlan" } },
          },
        },
        responses: {
          "201": { $ref: "#/components/responses/CreatedEntity" },
          default: { $ref: "#/components/responses/Error" },
        },
      },
    },
    "/v1/budget-definitions": {
      post: {
        operationId: "createBudgetDefinition",
        security: secured,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CreateBudgetDefinition" } },
          },
        },
        responses: {
          "201": { $ref: "#/components/responses/CreatedEntity" },
          default: { $ref: "#/components/responses/Error" },
        },
      },
    },
    "/v1/budget-periods": {
      post: {
        operationId: "createBudgetPeriod",
        security: secured,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CreateBudgetPeriod" } },
          },
        },
        responses: {
          "201": { $ref: "#/components/responses/CreatedEntity" },
          default: { $ref: "#/components/responses/Error" },
        },
      },
    },
    "/v1/transactions": {
      post: {
        operationId: "createTransaction",
        security: secured,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CreateTransaction" } },
          },
        },
        responses: {
          "201": { $ref: "#/components/responses/CreatedEntity" },
          default: { $ref: "#/components/responses/Error" },
        },
      },
    },
    "/v1/monthly-plans/{monthlyPlanId}/available-to-spend": {
      get: {
        operationId: "getAvailableToSpend",
        security: secured,
        parameters: [
          {
            name: "monthlyPlanId",
            in: "path",
            required: true,
            schema: uuid,
          },
        ],
        responses: {
          "200": {
            description: "Canonical available-to-spend breakdown",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AvailableToSpendBreakdown" },
              },
            },
          },
          default: { $ref: "#/components/responses/Error" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      NeonAuthBearer: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "JWT verificado pelo adapter de identidade do Managed Better Auth. Esquema destinado aos ambientes com autenticação real habilitada.",
      },
      PilotUserId: {
        type: "apiKey",
        in: "header",
        name: "x-dindin-user-id",
        description:
          "Fallback técnico exclusivo do piloto pessoal/desenvolvimento. Não é autenticação segura e deve permanecer desabilitado em beta/produção.",
      },
    },
    responses: {
      CreatedEntity: {
        description: "Entity created",
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/CreatedEntity" } },
        },
      },
      Error: {
        description: "Error response",
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/ApiError" } },
        },
      },
    },
    schemas: {
      HealthResponse: {
        type: "object",
        required: ["status", "service"],
        properties: {
          status: { const: "ok" },
          service: { const: "dindin-api" },
        },
      },
      CreatedEntity: {
        type: "object",
        required: ["id", "version"],
        properties: { id: uuid, version: { type: "integer", minimum: 1 } },
      },
      CreatedProfile: {
        type: "object",
        required: ["userId", "version"],
        properties: { userId: uuid, version: { type: "integer", minimum: 1 } },
      },
      ApiError: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "object",
            required: ["code", "message"],
            properties: {
              code: {
                type: "string",
                enum: [
                  "VALIDATION_ERROR",
                  "UNAUTHORIZED",
                  "NOT_FOUND",
                  "CONFLICT",
                  "DOMAIN_INVARIANT",
                  "INTERNAL_ERROR",
                ],
              },
              message: { type: "string" },
              details: {},
            },
          },
        },
      },
      CreateProfile: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 120 },
          locale: { type: "string", default: "pt-BR" },
          timezone: { type: "string", default: "America/Sao_Paulo" },
          defaultCurrency: { type: "string", pattern: "^[A-Z]{3}$", default: "BRL" },
          financialMonthDay: { type: ["integer", "null"], minimum: 1, maximum: 28 },
        },
      },
      CreateFinancialAccount: {
        type: "object",
        required: ["name", "accountType"],
        properties: {
          id: uuid,
          name: { type: "string", minLength: 1, maxLength: 120 },
          accountType: {
            type: "string",
            enum: ["checking", "savings", "cash", "wallet", "credit_card", "other"],
          },
          currency: { type: "string", pattern: "^[A-Z]{3}$", default: "BRL" },
          includeInNetCash: { type: "boolean", default: true },
        },
      },
      CreateCategory: {
        type: "object",
        required: ["name", "categoryKind"],
        properties: {
          id: uuid,
          name: { type: "string", minLength: 1, maxLength: 80 },
          categoryKind: { type: "string", enum: ["income", "expense", "transfer"] },
          parentId: { anyOf: [uuid, { type: "null" }] },
          iconKey: { type: ["string", "null"] },
        },
      },
      CreateMonthlyPlan: {
        type: "object",
        required: ["periodYear", "periodMonth", "expectedIncomeMinor"],
        properties: {
          id: uuid,
          periodYear: { type: "integer", minimum: 2000, maximum: 2200 },
          periodMonth: { type: "integer", minimum: 1, maximum: 12 },
          expectedIncomeMinor: moneyMinor,
          currency: { type: "string", pattern: "^[A-Z]{3}$", default: "BRL" },
          unassignedCarryInMinor: { ...moneyMinor, default: "0" },
        },
      },
      CreateBudgetDefinition: {
        type: "object",
        required: ["name", "budgetKind", "spendability"],
        properties: {
          id: uuid,
          name: { type: "string", minLength: 1, maxLength: 120 },
          budgetKind: {
            type: "string",
            enum: ["obligation", "consumption", "reserve", "future_need", "goal", "free"],
          },
          spendability: { type: "string", enum: ["spendable", "protected"] },
          categoryId: { anyOf: [uuid, { type: "null" }] },
          rolloverMode: { type: "string", enum: ["none", "positive_only", "full"], default: "none" },
        },
      },
      CreateBudgetPeriod: {
        type: "object",
        required: ["monthlyPlanId", "budgetDefinitionId", "plannedMinor"],
        properties: {
          id: uuid,
          monthlyPlanId: uuid,
          budgetDefinitionId: uuid,
          plannedMinor: moneyMinor,
          carriedInMinor: { ...moneyMinor, default: "0" },
        },
      },
      CreateTransaction: {
        type: "object",
        required: ["transactionType", "amountMinor", "occurredAt", "localDate"],
        properties: {
          id: uuid,
          transactionType: { type: "string", enum: ["income", "expense", "transfer"] },
          amountMinor: { type: "string", pattern: "^[1-9]\\d*$" },
          currency: { type: "string", pattern: "^[A-Z]{3}$", default: "BRL" },
          description: { type: ["string", "null"], maxLength: 240 },
          categoryId: { anyOf: [uuid, { type: "null" }] },
          sourceAccountId: { anyOf: [uuid, { type: "null" }] },
          destinationAccountId: { anyOf: [uuid, { type: "null" }] },
          budgetPeriodId: { anyOf: [uuid, { type: "null" }] },
          occurredAt: { type: "string", format: "date-time" },
          localDate: { type: "string", format: "date" },
          sourceType: {
            type: "string",
            enum: ["manual", "recurring", "installment", "import", "integration", "system"],
            default: "manual",
          },
          externalReference: { type: ["string", "null"] },
          notes: { type: ["string", "null"], maxLength: 1000 },
        },
      },
      AvailableToSpendBreakdown: {
        type: "object",
        required: [
          "monthlyPlanId",
          "currency",
          "fundingState",
          "effectiveIncomeMinor",
          "carryInTotalMinor",
          "effectiveFundsMinor",
          "totalAllocatedMinor",
          "postedExpensesMinor",
          "protectedRemainingMinor",
          "unfundedCommitmentsMinor",
          "unassignedMinor",
          "unassignedPositiveMinor",
          "planningConflictMinor",
          "hasPlanningConflict",
          "availableToSpendMinor",
          "budgets",
          "calculatedAt",
        ],
        properties: {
          monthlyPlanId: uuid,
          currency: { type: "string", pattern: "^[A-Z]{3}$" },
          fundingState: { type: "string", enum: ["projected", "reconciled"] },
          effectiveIncomeMinor: moneyMinor,
          carryInTotalMinor: moneyMinor,
          effectiveFundsMinor: moneyMinor,
          totalAllocatedMinor: moneyMinor,
          postedExpensesMinor: moneyMinor,
          protectedRemainingMinor: moneyMinor,
          unfundedCommitmentsMinor: moneyMinor,
          unassignedMinor: signedMoneyMinor,
          unassignedPositiveMinor: moneyMinor,
          planningConflictMinor: moneyMinor,
          hasPlanningConflict: { type: "boolean" },
          availableToSpendMinor: signedMoneyMinor,
          budgets: {
            type: "array",
            items: {
              type: "object",
              required: ["id", "spendability", "capacityMinor", "postedExpenseMinor", "remainingMinor"],
              properties: {
                id: { type: "string" },
                spendability: { type: "string", enum: ["spendable", "protected"] },
                capacityMinor: moneyMinor,
                postedExpenseMinor: moneyMinor,
                remainingMinor: signedMoneyMinor,
              },
            },
          },
          calculatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
} as const;
