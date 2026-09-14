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

interface StoredProfile extends ProfileWrite {
  version: number;
}

interface StoredFinancialAccount extends FinancialAccountWrite {
  version: number;
}

interface StoredCategory extends CategoryWrite {
  version: number;
}

interface StoredMonthlyPlan extends MonthlyPlanWrite {
  status: "active";
  fundingState: "projected";
  reconciledIncomeMinor: null;
  version: number;
}

interface StoredBudgetDefinition extends BudgetDefinitionWrite {
  version: number;
}

interface StoredBudgetPeriod extends BudgetPeriodWrite {
  version: number;
}

interface StoredTransaction extends TransactionWrite {
  status: "posted";
  version: number;
}

const created = (id: string): CreatedRecord => ({ id, version: 1 });

export class InMemoryDindinStore implements DindinStore {
  private readonly profiles = new Map<string, StoredProfile>();
  private readonly accounts = new Map<string, StoredFinancialAccount>();
  private readonly categories = new Map<string, StoredCategory>();
  private readonly monthlyPlans = new Map<string, StoredMonthlyPlan>();
  private readonly budgetDefinitions = new Map<string, StoredBudgetDefinition>();
  private readonly budgetPeriods = new Map<string, StoredBudgetPeriod>();
  private readonly transactions = new Map<string, StoredTransaction>();

  async createProfile(input: ProfileWrite): Promise<CreatedProfileRecord> {
    if (this.profiles.has(input.userId)) {
      throw new ApplicationError("CONFLICT", "profile already exists");
    }

    this.profiles.set(input.userId, { ...input, version: 1 });
    return { userId: input.userId, version: 1 };
  }

  async createFinancialAccount(input: FinancialAccountWrite): Promise<CreatedRecord> {
    this.assertUser(input.userId);
    this.assertNewId(this.accounts, input.id, "financial account");
    this.accounts.set(input.id, { ...input, version: 1 });
    return created(input.id);
  }

  async createCategory(input: CategoryWrite): Promise<CreatedRecord> {
    this.assertUser(input.userId);
    this.assertNewId(this.categories, input.id, "category");

    if (input.parentId) {
      const parent = this.categories.get(input.parentId);
      if (!parent || parent.userId !== input.userId) {
        throw new ApplicationError("NOT_FOUND", "parent category was not found");
      }
    }

    this.categories.set(input.id, { ...input, version: 1 });
    return created(input.id);
  }

  async createMonthlyPlan(input: MonthlyPlanWrite): Promise<CreatedRecord> {
    this.assertUser(input.userId);
    this.assertNewId(this.monthlyPlans, input.id, "monthly plan");

    for (const plan of this.monthlyPlans.values()) {
      if (
        plan.userId === input.userId &&
        plan.periodYear === input.periodYear &&
        plan.periodMonth === input.periodMonth
      ) {
        throw new ApplicationError("CONFLICT", "monthly plan already exists for this period");
      }
    }

    this.monthlyPlans.set(input.id, {
      ...input,
      status: "active",
      fundingState: "projected",
      reconciledIncomeMinor: null,
      version: 1,
    });
    return created(input.id);
  }

  async createBudgetDefinition(input: BudgetDefinitionWrite): Promise<CreatedRecord> {
    this.assertUser(input.userId);
    this.assertNewId(this.budgetDefinitions, input.id, "budget definition");

    if (input.categoryId) {
      const category = this.categories.get(input.categoryId);
      if (!category || category.userId !== input.userId) {
        throw new ApplicationError("NOT_FOUND", "category was not found");
      }
    }

    this.budgetDefinitions.set(input.id, { ...input, version: 1 });
    return created(input.id);
  }

  async createBudgetPeriod(input: BudgetPeriodWrite): Promise<CreatedRecord> {
    this.assertUser(input.userId);
    this.assertNewId(this.budgetPeriods, input.id, "budget period");

    const plan = this.monthlyPlans.get(input.monthlyPlanId);
    if (!plan || plan.userId !== input.userId) {
      throw new ApplicationError("NOT_FOUND", "monthly plan was not found");
    }

    const definition = this.budgetDefinitions.get(input.budgetDefinitionId);
    if (!definition || definition.userId !== input.userId) {
      throw new ApplicationError("NOT_FOUND", "budget definition was not found");
    }

    for (const period of this.budgetPeriods.values()) {
      if (
        period.monthlyPlanId === input.monthlyPlanId &&
        period.budgetDefinitionId === input.budgetDefinitionId
      ) {
        throw new ApplicationError("CONFLICT", "budget already exists in this monthly plan");
      }
    }

    this.budgetPeriods.set(input.id, { ...input, version: 1 });
    return created(input.id);
  }

  async createTransaction(input: TransactionWrite): Promise<CreatedRecord> {
    this.assertUser(input.userId);
    this.assertNewId(this.transactions, input.id, "transaction");

    if (input.categoryId) {
      const category = this.categories.get(input.categoryId);
      if (!category || category.userId !== input.userId) {
        throw new ApplicationError("NOT_FOUND", "category was not found");
      }
    }

    if (input.sourceAccountId) {
      this.assertAccount(input.userId, input.sourceAccountId);
    }
    if (input.destinationAccountId) {
      this.assertAccount(input.userId, input.destinationAccountId);
    }

    if (input.budgetPeriodId) {
      const period = this.budgetPeriods.get(input.budgetPeriodId);
      if (!period || period.userId !== input.userId) {
        throw new ApplicationError("NOT_FOUND", "budget period was not found");
      }
    }

    this.transactions.set(input.id, { ...input, status: "posted", version: 1 });
    return created(input.id);
  }

  async getPlanningProjection(
    userId: string,
    monthlyPlanId: string,
  ): Promise<PlanningProjection | null> {
    const plan = this.monthlyPlans.get(monthlyPlanId);
    if (!plan || plan.userId !== userId) {
      return null;
    }

    const periods = [...this.budgetPeriods.values()].filter(
      (period) => period.userId === userId && period.monthlyPlanId === monthlyPlanId,
    );

    const budgets = periods.map((period) => {
      const definition = this.budgetDefinitions.get(period.budgetDefinitionId);
      if (!definition) {
        throw new ApplicationError("NOT_FOUND", "budget definition was not found");
      }

      const postedExpenseMinor = [...this.transactions.values()]
        .filter(
          (transaction) =>
            transaction.userId === userId &&
            transaction.status === "posted" &&
            transaction.transactionType === "expense" &&
            transaction.budgetPeriodId === period.id,
        )
        .reduce((sum, transaction) => sum + transaction.amountMinor, 0n);

      return {
        id: period.id,
        spendability: definition.spendability,
        plannedMinor: period.plannedMinor,
        carriedInMinor: period.carriedInMinor,
        reallocationsInMinor: 0n,
        reallocationsOutMinor: 0n,
        postedExpenseMinor,
      };
    });

    const periodPrefix = `${plan.periodYear}-${String(plan.periodMonth).padStart(2, "0")}-`;
    const unbudgetedPostedExpensesMinor = [...this.transactions.values()]
      .filter(
        (transaction) =>
          transaction.userId === userId &&
          transaction.status === "posted" &&
          transaction.transactionType === "expense" &&
          !transaction.budgetPeriodId &&
          transaction.localDate.startsWith(periodPrefix),
      )
      .reduce((sum, transaction) => sum + transaction.amountMinor, 0n);

    return {
      monthlyPlanId: plan.id,
      currency: plan.currency,
      status: plan.status,
      fundingState: plan.fundingState,
      expectedIncomeMinor: plan.expectedIncomeMinor,
      reconciledIncomeMinor: plan.reconciledIncomeMinor,
      unassignedCarryInMinor: plan.unassignedCarryInMinor,
      budgets,
      unbudgetedPostedExpensesMinor,
      unfundedCommitmentsMinor: 0n,
    };
  }

  private assertUser(userId: string): void {
    if (!this.profiles.has(userId)) {
      throw new ApplicationError("NOT_FOUND", "profile was not found");
    }
  }

  private assertAccount(userId: string, accountId: string): void {
    const account = this.accounts.get(accountId);
    if (!account || account.userId !== userId) {
      throw new ApplicationError("NOT_FOUND", "financial account was not found");
    }
  }

  private assertNewId<T>(map: Map<string, T>, id: string, label: string): void {
    if (map.has(id)) {
      throw new ApplicationError("CONFLICT", `${label} already exists`);
    }
  }
}
