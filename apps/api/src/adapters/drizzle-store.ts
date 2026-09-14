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
import { and, eq } from "drizzle-orm";
import { ApplicationError } from "../application/errors";
import type {
  BudgetDefinitionWrite,
  BudgetPeriodWrite,
  CategoryWrite,
  CreatedProfileRecord,
  CreatedRecord,
  DindinStore,
  FinancialAccountWrite,
  MonthlyPlanWrite,
  PlanningProjection,
  ProfileWrite,
  TransactionWrite,
} from "../ports/store";

type DindinDb = ReturnType<typeof createDb>;

const created = (id: string, version: number): CreatedRecord => ({ id, version });

function mapPersistenceError(error: unknown): never {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code ?? "")
      : "";

  if (code === "23505") {
    throw new ApplicationError("CONFLICT", "resource already exists");
  }
  if (code === "23503" || code === "23514") {
    throw new ApplicationError("CONFLICT", "persistence constraint rejected the request");
  }
  throw error;
}

function asPlanStatus(value: string): "draft" | "active" | "closed" {
  if (value === "draft" || value === "active" || value === "closed") return value;
  throw new Error(`invalid persisted monthly plan status: ${value}`);
}

function asFundingState(value: string): "projected" | "reconciled" {
  if (value === "projected" || value === "reconciled") return value;
  throw new Error(`invalid persisted funding state: ${value}`);
}

function asSpendability(value: string): "spendable" | "protected" {
  if (value === "spendable" || value === "protected") return value;
  throw new Error(`invalid persisted spendability: ${value}`);
}

export class DrizzleDindinStore implements DindinStore {
  constructor(private readonly db: DindinDb) {}

  async createProfile(input: ProfileWrite): Promise<CreatedProfileRecord> {
    try {
      const [row] = await this.db
        .insert(profiles)
        .values({
          userId: input.userId,
          name: input.name,
          locale: input.locale,
          timezone: input.timezone,
          defaultCurrency: input.defaultCurrency,
          ...(input.financialMonthDay === undefined
            ? {}
            : { financialMonthDay: input.financialMonthDay }),
        })
        .returning({ userId: profiles.userId, version: profiles.version });

      if (!row) throw new Error("profile insert returned no row");
      return row;
    } catch (error) {
      mapPersistenceError(error);
    }
  }

  async createFinancialAccount(input: FinancialAccountWrite): Promise<CreatedRecord> {
    try {
      const [row] = await this.db
        .insert(financialAccounts)
        .values({
          id: input.id,
          userId: input.userId,
          name: input.name,
          accountType: input.accountType,
          currency: input.currency,
          includeInNetCash: input.includeInNetCash,
        })
        .returning({ id: financialAccounts.id, version: financialAccounts.version });

      if (!row) throw new Error("financial account insert returned no row");
      return created(row.id, row.version);
    } catch (error) {
      mapPersistenceError(error);
    }
  }

  async createCategory(input: CategoryWrite): Promise<CreatedRecord> {
    try {
      const [row] = await this.db
        .insert(categories)
        .values({
          id: input.id,
          userId: input.userId,
          name: input.name,
          categoryKind: input.categoryKind,
          ...(input.parentId === undefined ? {} : { parentId: input.parentId }),
          ...(input.iconKey === undefined ? {} : { iconKey: input.iconKey }),
        })
        .returning({ id: categories.id, version: categories.version });

      if (!row) throw new Error("category insert returned no row");
      return created(row.id, row.version);
    } catch (error) {
      mapPersistenceError(error);
    }
  }

  async createMonthlyPlan(input: MonthlyPlanWrite): Promise<CreatedRecord> {
    try {
      const [row] = await this.db
        .insert(monthlyPlans)
        .values({
          id: input.id,
          userId: input.userId,
          periodYear: input.periodYear,
          periodMonth: input.periodMonth,
          status: "active",
          fundingState: "projected",
          expectedIncomeMinor: input.expectedIncomeMinor,
          reconciledIncomeMinor: null,
          unassignedCarryInMinor: input.unassignedCarryInMinor,
          currency: input.currency,
          activatedAt: new Date(),
        })
        .returning({ id: monthlyPlans.id, version: monthlyPlans.version });

      if (!row) throw new Error("monthly plan insert returned no row");
      return created(row.id, row.version);
    } catch (error) {
      mapPersistenceError(error);
    }
  }

  async createBudgetDefinition(input: BudgetDefinitionWrite): Promise<CreatedRecord> {
    try {
      const [row] = await this.db
        .insert(budgetDefinitions)
        .values({
          id: input.id,
          userId: input.userId,
          name: input.name,
          budgetKind: input.budgetKind,
          spendability: input.spendability,
          ...(input.categoryId === undefined ? {} : { categoryId: input.categoryId }),
          rolloverMode: input.rolloverMode,
        })
        .returning({ id: budgetDefinitions.id, version: budgetDefinitions.version });

      if (!row) throw new Error("budget definition insert returned no row");
      return created(row.id, row.version);
    } catch (error) {
      mapPersistenceError(error);
    }
  }

  async createBudgetPeriod(input: BudgetPeriodWrite): Promise<CreatedRecord> {
    try {
      const [row] = await this.db
        .insert(budgetPeriods)
        .values({
          id: input.id,
          userId: input.userId,
          monthlyPlanId: input.monthlyPlanId,
          budgetDefinitionId: input.budgetDefinitionId,
          plannedMinor: input.plannedMinor,
          carriedInMinor: input.carriedInMinor,
        })
        .returning({ id: budgetPeriods.id, version: budgetPeriods.version });

      if (!row) throw new Error("budget period insert returned no row");
      return created(row.id, row.version);
    } catch (error) {
      mapPersistenceError(error);
    }
  }

  async createTransaction(input: TransactionWrite): Promise<CreatedRecord> {
    try {
      const [row] = await this.db
        .insert(transactions)
        .values({
          id: input.id,
          userId: input.userId,
          transactionType: input.transactionType,
          status: "posted",
          amountMinor: input.amountMinor,
          currency: input.currency,
          ...(input.description === undefined ? {} : { description: input.description }),
          ...(input.categoryId === undefined ? {} : { categoryId: input.categoryId }),
          ...(input.sourceAccountId === undefined
            ? {}
            : { sourceAccountId: input.sourceAccountId }),
          ...(input.destinationAccountId === undefined
            ? {}
            : { destinationAccountId: input.destinationAccountId }),
          ...(input.budgetPeriodId === undefined
            ? {}
            : { budgetPeriodId: input.budgetPeriodId }),
          occurredAt: new Date(input.occurredAt),
          localDate: input.localDate,
          sourceType: input.sourceType,
          ...(input.externalReference === undefined
            ? {}
            : { externalReference: input.externalReference }),
          ...(input.notes === undefined ? {} : { notes: input.notes }),
        })
        .returning({ id: transactions.id, version: transactions.version });

      if (!row) throw new Error("transaction insert returned no row");
      return created(row.id, row.version);
    } catch (error) {
      mapPersistenceError(error);
    }
  }

  async getPlanningProjection(
    userId: string,
    monthlyPlanId: string,
  ): Promise<PlanningProjection | null> {
    const [plan] = await this.db
      .select()
      .from(monthlyPlans)
      .where(and(eq(monthlyPlans.id, monthlyPlanId), eq(monthlyPlans.userId, userId)))
      .limit(1);

    if (!plan) return null;

    const periodRows = await this.db
      .select({
        id: budgetPeriods.id,
        plannedMinor: budgetPeriods.plannedMinor,
        carriedInMinor: budgetPeriods.carriedInMinor,
        spendability: budgetDefinitions.spendability,
      })
      .from(budgetPeriods)
      .innerJoin(
        budgetDefinitions,
        eq(budgetPeriods.budgetDefinitionId, budgetDefinitions.id),
      )
      .where(
        and(eq(budgetPeriods.userId, userId), eq(budgetPeriods.monthlyPlanId, monthlyPlanId)),
      );

    const reallocationRows = await this.db
      .select({
        fromBudgetPeriodId: budgetReallocations.fromBudgetPeriodId,
        toBudgetPeriodId: budgetReallocations.toBudgetPeriodId,
        amountMinor: budgetReallocations.amountMinor,
      })
      .from(budgetReallocations)
      .where(
        and(
          eq(budgetReallocations.userId, userId),
          eq(budgetReallocations.monthlyPlanId, monthlyPlanId),
        ),
      );

    const transactionRows = await this.db
      .select({
        budgetPeriodId: transactions.budgetPeriodId,
        amountMinor: transactions.amountMinor,
        localDate: transactions.localDate,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.status, "posted"),
          eq(transactions.transactionType, "expense"),
        ),
      );

    const reallocationIn = new Map<string, bigint>();
    const reallocationOut = new Map<string, bigint>();
    for (const row of reallocationRows) {
      reallocationOut.set(
        row.fromBudgetPeriodId,
        (reallocationOut.get(row.fromBudgetPeriodId) ?? 0n) + row.amountMinor,
      );
      reallocationIn.set(
        row.toBudgetPeriodId,
        (reallocationIn.get(row.toBudgetPeriodId) ?? 0n) + row.amountMinor,
      );
    }

    const postedByBudget = new Map<string, bigint>();
    for (const row of transactionRows) {
      if (!row.budgetPeriodId) continue;
      postedByBudget.set(
        row.budgetPeriodId,
        (postedByBudget.get(row.budgetPeriodId) ?? 0n) + row.amountMinor,
      );
    }

    const budgets = periodRows.map((row) => ({
      id: row.id,
      spendability: asSpendability(row.spendability),
      plannedMinor: row.plannedMinor,
      carriedInMinor: row.carriedInMinor,
      reallocationsInMinor: reallocationIn.get(row.id) ?? 0n,
      reallocationsOutMinor: reallocationOut.get(row.id) ?? 0n,
      postedExpenseMinor: postedByBudget.get(row.id) ?? 0n,
    }));

    const periodPrefix = `${plan.periodYear}-${String(plan.periodMonth).padStart(2, "0")}-`;
    const unbudgetedPostedExpensesMinor = transactionRows
      .filter((row) => !row.budgetPeriodId && row.localDate.startsWith(periodPrefix))
      .reduce((sum, row) => sum + row.amountMinor, 0n);

    return {
      monthlyPlanId: plan.id,
      currency: plan.currency,
      status: asPlanStatus(plan.status),
      fundingState: asFundingState(plan.fundingState),
      expectedIncomeMinor: plan.expectedIncomeMinor,
      reconciledIncomeMinor: plan.reconciledIncomeMinor,
      unassignedCarryInMinor: plan.unassignedCarryInMinor,
      budgets,
      unbudgetedPostedExpensesMinor,
      unfundedCommitmentsMinor: 0n,
    };
  }
}
