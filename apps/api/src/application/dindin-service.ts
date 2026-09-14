import type {
  AvailableToSpendBreakdown,
  CreateBudgetDefinitionInput,
  CreateBudgetPeriodInput,
  CreateCategoryInput,
  CreateFinancialAccountInput,
  CreateMonthlyPlanInput,
  CreateProfileInput,
  CreateTransactionInput,
} from "@dindin/contracts";
import { calculateAvailableToSpend } from "@dindin/domain";
import { parseMoneyMinor, serializeMoneyMinor } from "../adapters/money";
import { ApplicationError } from "./errors";
import type { CreatedProfileRecord, CreatedRecord, DindinStore } from "../ports/store";

const newId = (): string => crypto.randomUUID();

export class DindinService {
  constructor(private readonly store: DindinStore) {}

  createProfile(userId: string, input: CreateProfileInput): Promise<CreatedProfileRecord> {
    return this.store.createProfile({
      userId,
      name: input.name,
      locale: input.locale,
      timezone: input.timezone,
      defaultCurrency: input.defaultCurrency,
      financialMonthDay: input.financialMonthDay,
    });
  }

  createFinancialAccount(
    userId: string,
    input: CreateFinancialAccountInput,
  ): Promise<CreatedRecord> {
    return this.store.createFinancialAccount({
      id: input.id ?? newId(),
      userId,
      name: input.name,
      accountType: input.accountType,
      currency: input.currency,
      includeInNetCash: input.includeInNetCash,
    });
  }

  createCategory(userId: string, input: CreateCategoryInput): Promise<CreatedRecord> {
    return this.store.createCategory({
      id: input.id ?? newId(),
      userId,
      name: input.name,
      categoryKind: input.categoryKind,
      parentId: input.parentId,
      iconKey: input.iconKey,
    });
  }

  createMonthlyPlan(userId: string, input: CreateMonthlyPlanInput): Promise<CreatedRecord> {
    return this.store.createMonthlyPlan({
      id: input.id ?? newId(),
      userId,
      periodYear: input.periodYear,
      periodMonth: input.periodMonth,
      expectedIncomeMinor: parseMoneyMinor(input.expectedIncomeMinor),
      currency: input.currency,
      unassignedCarryInMinor: parseMoneyMinor(input.unassignedCarryInMinor),
    });
  }

  createBudgetDefinition(
    userId: string,
    input: CreateBudgetDefinitionInput,
  ): Promise<CreatedRecord> {
    return this.store.createBudgetDefinition({
      id: input.id ?? newId(),
      userId,
      name: input.name,
      budgetKind: input.budgetKind,
      spendability: input.spendability,
      categoryId: input.categoryId,
      rolloverMode: input.rolloverMode,
    });
  }

  createBudgetPeriod(userId: string, input: CreateBudgetPeriodInput): Promise<CreatedRecord> {
    return this.store.createBudgetPeriod({
      id: input.id ?? newId(),
      userId,
      monthlyPlanId: input.monthlyPlanId,
      budgetDefinitionId: input.budgetDefinitionId,
      plannedMinor: parseMoneyMinor(input.plannedMinor),
      carriedInMinor: parseMoneyMinor(input.carriedInMinor),
    });
  }

  createTransaction(userId: string, input: CreateTransactionInput): Promise<CreatedRecord> {
    return this.store.createTransaction({
      id: input.id ?? newId(),
      userId,
      transactionType: input.transactionType,
      amountMinor: parseMoneyMinor(input.amountMinor),
      currency: input.currency,
      description: input.description,
      categoryId: input.categoryId,
      sourceAccountId: input.sourceAccountId,
      destinationAccountId: input.destinationAccountId,
      budgetPeriodId: input.budgetPeriodId,
      occurredAt: input.occurredAt,
      localDate: input.localDate,
      sourceType: input.sourceType,
      externalReference: input.externalReference,
      notes: input.notes,
    });
  }

  async getAvailableToSpend(
    userId: string,
    monthlyPlanId: string,
  ): Promise<AvailableToSpendBreakdown> {
    const projection = await this.store.getPlanningProjection(userId, monthlyPlanId);

    if (!projection) {
      throw new ApplicationError("NOT_FOUND", "monthly plan was not found");
    }

    const result = calculateAvailableToSpend({
      monthlyPlanId: projection.monthlyPlanId,
      currency: projection.currency,
      status: projection.status,
      fundingState: projection.fundingState,
      expectedIncomeMinor: projection.expectedIncomeMinor,
      ...(projection.reconciledIncomeMinor === undefined
        ? {}
        : { reconciledIncomeMinor: projection.reconciledIncomeMinor }),
      unassignedCarryInMinor: projection.unassignedCarryInMinor,
      budgets: projection.budgets,
      unbudgetedPostedExpensesMinor: projection.unbudgetedPostedExpensesMinor,
      unfundedCommitmentsMinor: projection.unfundedCommitmentsMinor,
    });

    return {
      monthlyPlanId: result.monthlyPlanId,
      currency: result.currency,
      fundingState: result.fundingState,
      effectiveIncomeMinor: serializeMoneyMinor(result.effectiveIncomeMinor),
      carryInTotalMinor: serializeMoneyMinor(result.carryInTotalMinor),
      effectiveFundsMinor: serializeMoneyMinor(result.effectiveFundsMinor),
      totalAllocatedMinor: serializeMoneyMinor(result.totalAllocatedMinor),
      postedExpensesMinor: serializeMoneyMinor(result.postedExpensesMinor),
      protectedRemainingMinor: serializeMoneyMinor(result.protectedRemainingMinor),
      unfundedCommitmentsMinor: serializeMoneyMinor(result.unfundedCommitmentsMinor),
      unassignedMinor: serializeMoneyMinor(result.unassignedMinor),
      unassignedPositiveMinor: serializeMoneyMinor(result.unassignedPositiveMinor),
      planningConflictMinor: serializeMoneyMinor(result.planningConflictMinor),
      hasPlanningConflict: result.hasPlanningConflict,
      availableToSpendMinor: serializeMoneyMinor(result.availableToSpendMinor),
      budgets: result.budgets.map((budget) => ({
        id: budget.id,
        spendability: budget.spendability,
        capacityMinor: serializeMoneyMinor(budget.capacityMinor),
        postedExpenseMinor: serializeMoneyMinor(budget.postedExpenseMinor),
        remainingMinor: serializeMoneyMinor(budget.remainingMinor),
      })),
      calculatedAt: new Date().toISOString(),
    };
  }
}
