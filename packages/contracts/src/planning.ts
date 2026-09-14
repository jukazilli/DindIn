import { z } from "zod";
import { UuidSchema } from "./core";
import {
  CurrencyCodeSchema,
  MoneyMinorSchema,
  PositiveMoneyMinorSchema,
  SignedMoneyMinorSchema,
} from "./money";

export const MonthlyPlanStatusSchema = z.enum(["draft", "active", "closed"]);
export const FundingStateSchema = z.enum(["projected", "reconciled"]);
export const BudgetKindSchema = z.enum([
  "obligation",
  "consumption",
  "reserve",
  "future_need",
  "goal",
  "free",
]);
export const SpendabilitySchema = z.enum(["spendable", "protected"]);
export const RolloverModeSchema = z.enum(["none", "positive_only", "full"]);

export const CreateMonthlyPlanSchema = z.object({
  id: UuidSchema.optional(),
  periodYear: z.number().int().min(2000).max(2200),
  periodMonth: z.number().int().min(1).max(12),
  expectedIncomeMinor: MoneyMinorSchema,
  currency: CurrencyCodeSchema.default("BRL"),
  unassignedCarryInMinor: MoneyMinorSchema.default("0"),
});

export const ReconcileMonthlyIncomeSchema = z.object({
  reconciledIncomeMinor: MoneyMinorSchema,
  expectedVersion: z.number().int().min(1),
});

export const CreateBudgetDefinitionSchema = z.object({
  id: UuidSchema.optional(),
  name: z.string().trim().min(1).max(120),
  budgetKind: BudgetKindSchema,
  spendability: SpendabilitySchema,
  categoryId: UuidSchema.nullable().optional(),
  rolloverMode: RolloverModeSchema.default("none"),
});

export const CreateBudgetPeriodSchema = z.object({
  id: UuidSchema.optional(),
  monthlyPlanId: UuidSchema,
  budgetDefinitionId: UuidSchema,
  plannedMinor: MoneyMinorSchema,
  carriedInMinor: MoneyMinorSchema.default("0"),
});

export const ReallocateBudgetSchema = z
  .object({
    id: UuidSchema.optional(),
    monthlyPlanId: UuidSchema,
    fromBudgetPeriodId: UuidSchema,
    toBudgetPeriodId: UuidSchema,
    amountMinor: PositiveMoneyMinorSchema,
    reason: z.string().trim().max(240).nullable().optional(),
    expectedSourceVersion: z.number().int().min(1),
    expectedTargetVersion: z.number().int().min(1),
  })
  .refine((value) => value.fromBudgetPeriodId !== value.toBudgetPeriodId, {
    message: "source and target budget periods must be different",
    path: ["toBudgetPeriodId"],
  });

export const AvailableToSpendBudgetSchema = z.object({
  id: z.string().min(1),
  spendability: SpendabilitySchema,
  capacityMinor: MoneyMinorSchema,
  postedExpenseMinor: MoneyMinorSchema,
  remainingMinor: SignedMoneyMinorSchema,
});

export const AvailableToSpendBreakdownSchema = z.object({
  monthlyPlanId: UuidSchema,
  currency: CurrencyCodeSchema,
  fundingState: FundingStateSchema,
  effectiveIncomeMinor: MoneyMinorSchema,
  carryInTotalMinor: MoneyMinorSchema,
  effectiveFundsMinor: MoneyMinorSchema,
  totalAllocatedMinor: MoneyMinorSchema,
  postedExpensesMinor: MoneyMinorSchema,
  protectedRemainingMinor: MoneyMinorSchema,
  unfundedCommitmentsMinor: MoneyMinorSchema,
  unassignedMinor: SignedMoneyMinorSchema,
  unassignedPositiveMinor: MoneyMinorSchema,
  planningConflictMinor: MoneyMinorSchema,
  hasPlanningConflict: z.boolean(),
  availableToSpendMinor: SignedMoneyMinorSchema,
  budgets: z.array(AvailableToSpendBudgetSchema),
  calculatedAt: z.string().datetime(),
});

export type CreateMonthlyPlanInput = z.infer<typeof CreateMonthlyPlanSchema>;
export type CreateBudgetDefinitionInput = z.infer<typeof CreateBudgetDefinitionSchema>;
export type CreateBudgetPeriodInput = z.infer<typeof CreateBudgetPeriodSchema>;
export type ReallocateBudgetInput = z.infer<typeof ReallocateBudgetSchema>;
export type AvailableToSpendBreakdown = z.infer<typeof AvailableToSpendBreakdownSchema>;
