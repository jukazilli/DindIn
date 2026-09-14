import type {
  FundingState,
  PlanStatus,
  Spendability,
} from "@dindin/domain";

export interface CreatedRecord {
  id: string;
  version: number;
}

export interface CreatedProfileRecord {
  userId: string;
  version: number;
}

export interface ProfileWrite {
  userId: string;
  name: string;
  locale: string;
  timezone: string;
  defaultCurrency: string;
  financialMonthDay?: number | null;
}

export interface FinancialAccountWrite {
  id: string;
  userId: string;
  name: string;
  accountType: string;
  currency: string;
  includeInNetCash: boolean;
}

export interface CategoryWrite {
  id: string;
  userId: string;
  name: string;
  categoryKind: string;
  parentId?: string | null;
  iconKey?: string | null;
}

export interface MonthlyPlanWrite {
  id: string;
  userId: string;
  periodYear: number;
  periodMonth: number;
  expectedIncomeMinor: bigint;
  currency: string;
  unassignedCarryInMinor: bigint;
}

export interface BudgetDefinitionWrite {
  id: string;
  userId: string;
  name: string;
  budgetKind: string;
  spendability: Spendability;
  categoryId?: string | null;
  rolloverMode: string;
}

export interface BudgetPeriodWrite {
  id: string;
  userId: string;
  monthlyPlanId: string;
  budgetDefinitionId: string;
  plannedMinor: bigint;
  carriedInMinor: bigint;
}

export interface TransactionWrite {
  id: string;
  userId: string;
  transactionType: string;
  amountMinor: bigint;
  currency: string;
  description?: string | null;
  categoryId?: string | null;
  sourceAccountId?: string | null;
  destinationAccountId?: string | null;
  budgetPeriodId?: string | null;
  occurredAt: string;
  localDate: string;
  sourceType: string;
  externalReference?: string | null;
  notes?: string | null;
}

export interface PlanningBudgetProjection {
  id: string;
  spendability: Spendability;
  plannedMinor: bigint;
  carriedInMinor: bigint;
  reallocationsInMinor: bigint;
  reallocationsOutMinor: bigint;
  postedExpenseMinor: bigint;
}

export interface PlanningProjection {
  monthlyPlanId: string;
  currency: string;
  status: PlanStatus;
  fundingState: FundingState;
  expectedIncomeMinor: bigint;
  reconciledIncomeMinor?: bigint | null;
  unassignedCarryInMinor: bigint;
  budgets: readonly PlanningBudgetProjection[];
  unbudgetedPostedExpensesMinor: bigint;
  unfundedCommitmentsMinor: bigint;
}

export interface DindinStore {
  createProfile(input: ProfileWrite): Promise<CreatedProfileRecord>;
  createFinancialAccount(input: FinancialAccountWrite): Promise<CreatedRecord>;
  createCategory(input: CategoryWrite): Promise<CreatedRecord>;
  createMonthlyPlan(input: MonthlyPlanWrite): Promise<CreatedRecord>;
  createBudgetDefinition(input: BudgetDefinitionWrite): Promise<CreatedRecord>;
  createBudgetPeriod(input: BudgetPeriodWrite): Promise<CreatedRecord>;
  createTransaction(input: TransactionWrite): Promise<CreatedRecord>;
  getPlanningProjection(userId: string, monthlyPlanId: string): Promise<PlanningProjection | null>;
}
