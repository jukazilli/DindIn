import { DomainInvariantError } from "../errors";
import { assertNonNegativeMoney, maxZero } from "../money";

export type FundingState = "projected" | "reconciled";
export type PlanStatus = "draft" | "active" | "closed";
export type Spendability = "spendable" | "protected";

export interface BudgetPeriodSnapshot {
  id: string;
  spendability: Spendability;
  plannedMinor: bigint;
  carriedInMinor?: bigint;
  reallocationsInMinor?: bigint;
  reallocationsOutMinor?: bigint;
  postedExpenseMinor?: bigint;
}

export interface AvailableToSpendInput {
  monthlyPlanId: string;
  currency: string;
  status: PlanStatus;
  fundingState: FundingState;
  expectedIncomeMinor: bigint;
  reconciledIncomeMinor?: bigint | null;
  unassignedCarryInMinor?: bigint;
  budgets: readonly BudgetPeriodSnapshot[];
  unbudgetedPostedExpensesMinor?: bigint;
  unfundedCommitmentsMinor?: bigint;
}

export interface BudgetPeriodCalculation {
  id: string;
  spendability: Spendability;
  capacityMinor: bigint;
  postedExpenseMinor: bigint;
  remainingMinor: bigint;
}

export interface AvailableToSpendResult {
  monthlyPlanId: string;
  currency: string;
  fundingState: FundingState;
  effectiveIncomeMinor: bigint;
  carryInTotalMinor: bigint;
  effectiveFundsMinor: bigint;
  totalAllocatedMinor: bigint;
  postedExpensesMinor: bigint;
  protectedRemainingMinor: bigint;
  unfundedCommitmentsMinor: bigint;
  unassignedMinor: bigint;
  unassignedPositiveMinor: bigint;
  planningConflictMinor: bigint;
  hasPlanningConflict: boolean;
  availableToSpendMinor: bigint;
  budgets: readonly BudgetPeriodCalculation[];
}

function resolveEffectiveIncome(input: AvailableToSpendInput): bigint {
  assertNonNegativeMoney("expectedIncomeMinor", input.expectedIncomeMinor);

  if (input.fundingState === "projected") {
    if (input.reconciledIncomeMinor !== undefined && input.reconciledIncomeMinor !== null) {
      throw new DomainInvariantError(
        "PROJECTED_PLAN_WITH_RECONCILED_INCOME",
        "projected plans must not carry reconciled income",
      );
    }

    return input.expectedIncomeMinor;
  }

  if (input.reconciledIncomeMinor === undefined || input.reconciledIncomeMinor === null) {
    throw new DomainInvariantError(
      "RECONCILED_PLAN_WITHOUT_INCOME",
      "reconciled plans require reconciled income",
    );
  }

  assertNonNegativeMoney("reconciledIncomeMinor", input.reconciledIncomeMinor);
  return input.reconciledIncomeMinor;
}

export function calculateAvailableToSpend(
  input: AvailableToSpendInput,
): AvailableToSpendResult {
  const effectiveIncomeMinor = resolveEffectiveIncome(input);
  const unassignedCarryInMinor = input.unassignedCarryInMinor ?? 0n;
  const unbudgetedPostedExpensesMinor = input.unbudgetedPostedExpensesMinor ?? 0n;
  const unfundedCommitmentsMinor = input.unfundedCommitmentsMinor ?? 0n;

  assertNonNegativeMoney("unassignedCarryInMinor", unassignedCarryInMinor);
  assertNonNegativeMoney(
    "unbudgetedPostedExpensesMinor",
    unbudgetedPostedExpensesMinor,
  );
  assertNonNegativeMoney("unfundedCommitmentsMinor", unfundedCommitmentsMinor);

  let budgetCarryInTotalMinor = 0n;
  let totalAllocatedMinor = 0n;
  let postedBudgetExpensesMinor = 0n;
  let protectedRemainingMinor = 0n;
  let reallocationsInTotalMinor = 0n;
  let reallocationsOutTotalMinor = 0n;

  const budgetCalculations: BudgetPeriodCalculation[] = [];

  for (const budget of input.budgets) {
    const carriedInMinor = budget.carriedInMinor ?? 0n;
    const reallocationsInMinor = budget.reallocationsInMinor ?? 0n;
    const reallocationsOutMinor = budget.reallocationsOutMinor ?? 0n;
    const postedExpenseMinor = budget.postedExpenseMinor ?? 0n;

    assertNonNegativeMoney(`${budget.id}.plannedMinor`, budget.plannedMinor);
    assertNonNegativeMoney(`${budget.id}.carriedInMinor`, carriedInMinor);
    assertNonNegativeMoney(`${budget.id}.reallocationsInMinor`, reallocationsInMinor);
    assertNonNegativeMoney(`${budget.id}.reallocationsOutMinor`, reallocationsOutMinor);
    assertNonNegativeMoney(`${budget.id}.postedExpenseMinor`, postedExpenseMinor);

    const capacityMinor =
      budget.plannedMinor + carriedInMinor + reallocationsInMinor - reallocationsOutMinor;

    if (capacityMinor < 0n) {
      throw new DomainInvariantError(
        "NEGATIVE_BUDGET_CAPACITY",
        `budget ${budget.id} cannot have negative capacity`,
      );
    }

    const remainingMinor = capacityMinor - postedExpenseMinor;

    budgetCarryInTotalMinor += carriedInMinor;
    totalAllocatedMinor += capacityMinor;
    postedBudgetExpensesMinor += postedExpenseMinor;
    reallocationsInTotalMinor += reallocationsInMinor;
    reallocationsOutTotalMinor += reallocationsOutMinor;

    if (budget.spendability === "protected") {
      protectedRemainingMinor += maxZero(remainingMinor);
    }

    budgetCalculations.push({
      id: budget.id,
      spendability: budget.spendability,
      capacityMinor,
      postedExpenseMinor,
      remainingMinor,
    });
  }

  if (reallocationsInTotalMinor !== reallocationsOutTotalMinor) {
    throw new DomainInvariantError(
      "UNBALANCED_BUDGET_REALLOCATIONS",
      "budget reallocations must balance within the monthly plan",
    );
  }

  const carryInTotalMinor = budgetCarryInTotalMinor + unassignedCarryInMinor;
  const effectiveFundsMinor = effectiveIncomeMinor + carryInTotalMinor;
  const postedExpensesMinor = postedBudgetExpensesMinor + unbudgetedPostedExpensesMinor;
  const unassignedMinor = effectiveFundsMinor - totalAllocatedMinor;
  const unassignedPositiveMinor = maxZero(unassignedMinor);
  const planningConflictMinor = unassignedMinor < 0n ? -unassignedMinor : 0n;

  const availableToSpendMinor =
    effectiveFundsMinor -
    postedExpensesMinor -
    protectedRemainingMinor -
    unfundedCommitmentsMinor -
    unassignedPositiveMinor;

  return {
    monthlyPlanId: input.monthlyPlanId,
    currency: input.currency,
    fundingState: input.fundingState,
    effectiveIncomeMinor,
    carryInTotalMinor,
    effectiveFundsMinor,
    totalAllocatedMinor,
    postedExpensesMinor,
    protectedRemainingMinor,
    unfundedCommitmentsMinor,
    unassignedMinor,
    unassignedPositiveMinor,
    planningConflictMinor,
    hasPlanningConflict: planningConflictMinor > 0n,
    availableToSpendMinor,
    budgets: budgetCalculations,
  };
}
