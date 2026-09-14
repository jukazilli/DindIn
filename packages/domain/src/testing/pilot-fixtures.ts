import type { AvailableToSpendInput, BudgetPeriodSnapshot } from "../planning/available-to-spend";

const postedBudget = (
  id: string,
  spendability: BudgetPeriodSnapshot["spendability"],
  amountMinor: bigint,
): BudgetPeriodSnapshot => ({
  id,
  spendability,
  plannedMinor: amountMinor,
  postedExpenseMinor: amountMinor,
});

const basePostedBudgets: readonly BudgetPeriodSnapshot[] = [
  postedBudget("housing", "protected", 50_000n),
  postedBudget("studies", "protected", 49_200n),
  postedBudget("refrigerator", "protected", 19_000n),
  postedBudget("cnh", "protected", 27_000n),
  postedBudget("shopee", "spendable", 89_000n),
  postedBudget("mercado-livre", "spendable", 7_000n),
  postedBudget("caixa-card", "spendable", 7_000n),
];

export const pilotSeptember2026WithAccumulatedReserve: AvailableToSpendInput = {
  monthlyPlanId: "pilot-2026-09-accumulated-reserve",
  currency: "BRL",
  status: "active",
  fundingState: "projected",
  expectedIncomeMinor: 299_400n,
  budgets: [
    ...basePostedBudgets,
    {
      id: "free-money",
      spendability: "spendable",
      plannedMinor: 51_200n,
    },
    {
      id: "emergency-reserve",
      spendability: "protected",
      plannedMinor: 0n,
      carriedInMinor: 50_000n,
    },
  ],
};

export const pilotSeptember2026WithNewReserveContribution: AvailableToSpendInput = {
  monthlyPlanId: "pilot-2026-09-new-reserve",
  currency: "BRL",
  status: "active",
  fundingState: "projected",
  expectedIncomeMinor: 299_400n,
  budgets: [
    ...basePostedBudgets,
    {
      id: "free-money",
      spendability: "spendable",
      plannedMinor: 1_200n,
    },
    {
      id: "emergency-reserve",
      spendability: "protected",
      plannedMinor: 50_000n,
    },
  ],
};
