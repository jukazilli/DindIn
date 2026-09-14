import { describe, expect, it } from "vitest";
import { DomainInvariantError } from "../errors";
import {
  pilotSeptember2026WithAccumulatedReserve,
  pilotSeptember2026WithNewReserveContribution,
} from "../testing/pilot-fixtures";
import {
  calculateAvailableToSpend,
  type AvailableToSpendInput,
} from "./available-to-spend";

const makeInput = (
  overrides: Partial<AvailableToSpendInput> = {},
): AvailableToSpendInput => ({
  monthlyPlanId: "test-plan",
  currency: "BRL",
  status: "active",
  fundingState: "projected",
  expectedIncomeMinor: 100_000n,
  budgets: [
    {
      id: "free",
      spendability: "spendable",
      plannedMinor: 100_000n,
    },
  ],
  ...overrides,
});

describe("calculateAvailableToSpend", () => {
  it("returns R$ 512 for the pilot when R$ 500 is accumulated protected reserve", () => {
    const result = calculateAvailableToSpend(
      pilotSeptember2026WithAccumulatedReserve,
    );

    expect(result.effectiveFundsMinor).toBe(349_400n);
    expect(result.postedExpensesMinor).toBe(248_200n);
    expect(result.protectedRemainingMinor).toBe(50_000n);
    expect(result.unassignedMinor).toBe(0n);
    expect(result.availableToSpendMinor).toBe(51_200n);
  });

  it("returns R$ 12 when R$ 500 is a new reserve allocation in the current month", () => {
    const result = calculateAvailableToSpend(
      pilotSeptember2026WithNewReserveContribution,
    );

    expect(result.effectiveFundsMinor).toBe(299_400n);
    expect(result.postedExpensesMinor).toBe(248_200n);
    expect(result.protectedRemainingMinor).toBe(50_000n);
    expect(result.availableToSpendMinor).toBe(1_200n);
  });

  it("does not reduce availability twice when a protected obligation is paid", () => {
    const beforePayment = calculateAvailableToSpend(
      makeInput({
        expectedIncomeMinor: 200_000n,
        budgets: [
          {
            id: "housing",
            spendability: "protected",
            plannedMinor: 50_000n,
          },
          {
            id: "free",
            spendability: "spendable",
            plannedMinor: 150_000n,
          },
        ],
      }),
    );

    const afterPayment = calculateAvailableToSpend(
      makeInput({
        expectedIncomeMinor: 200_000n,
        budgets: [
          {
            id: "housing",
            spendability: "protected",
            plannedMinor: 50_000n,
            postedExpenseMinor: 50_000n,
          },
          {
            id: "free",
            spendability: "spendable",
            plannedMinor: 150_000n,
          },
        ],
      }),
    );

    expect(beforePayment.availableToSpendMinor).toBe(150_000n);
    expect(afterPayment.availableToSpendMinor).toBe(150_000n);
  });

  it("reduces global availability when a protected obligation costs more than planned", () => {
    const result = calculateAvailableToSpend(
      makeInput({
        expectedIncomeMinor: 200_000n,
        budgets: [
          {
            id: "housing",
            spendability: "protected",
            plannedMinor: 50_000n,
            postedExpenseMinor: 55_000n,
          },
          {
            id: "free",
            spendability: "spendable",
            plannedMinor: 150_000n,
          },
        ],
      }),
    );

    expect(result.protectedRemainingMinor).toBe(0n);
    expect(result.availableToSpendMinor).toBe(145_000n);
  });

  it("does not treat positive unassigned money as spendable", () => {
    const result = calculateAvailableToSpend(
      makeInput({
        expectedIncomeMinor: 100_000n,
        budgets: [
          {
            id: "free",
            spendability: "spendable",
            plannedMinor: 60_000n,
          },
        ],
      }),
    );

    expect(result.unassignedMinor).toBe(40_000n);
    expect(result.unassignedPositiveMinor).toBe(40_000n);
    expect(result.availableToSpendMinor).toBe(60_000n);
  });

  it("keeps negative availability instead of clamping it to zero", () => {
    const result = calculateAvailableToSpend(
      makeInput({
        budgets: [
          {
            id: "protected",
            spendability: "protected",
            plannedMinor: 50_000n,
          },
          {
            id: "consumption",
            spendability: "spendable",
            plannedMinor: 50_000n,
            postedExpenseMinor: 55_000n,
          },
        ],
      }),
    );

    expect(result.availableToSpendMinor).toBe(-5_000n);
  });

  it("subtracts expenses that are not attached to a budget", () => {
    const result = calculateAvailableToSpend(
      makeInput({
        unbudgetedPostedExpensesMinor: 10_000n,
      }),
    );

    expect(result.postedExpensesMinor).toBe(10_000n);
    expect(result.availableToSpendMinor).toBe(90_000n);
  });

  it("subtracts known commitments that are not funded by protected budgets", () => {
    const result = calculateAvailableToSpend(
      makeInput({
        unfundedCommitmentsMinor: 27_000n,
      }),
    );

    expect(result.unfundedCommitmentsMinor).toBe(27_000n);
    expect(result.availableToSpendMinor).toBe(73_000n);
  });

  it("keeps availability unchanged after a balanced budget reallocation", () => {
    const before = calculateAvailableToSpend(
      makeInput({
        budgets: [
          {
            id: "leisure",
            spendability: "spendable",
            plannedMinor: 40_000n,
          },
          {
            id: "shopping",
            spendability: "spendable",
            plannedMinor: 60_000n,
          },
        ],
      }),
    );

    const after = calculateAvailableToSpend(
      makeInput({
        budgets: [
          {
            id: "leisure",
            spendability: "spendable",
            plannedMinor: 40_000n,
            reallocationsOutMinor: 10_000n,
          },
          {
            id: "shopping",
            spendability: "spendable",
            plannedMinor: 60_000n,
            reallocationsInMinor: 10_000n,
          },
        ],
      }),
    );

    expect(before.availableToSpendMinor).toBe(100_000n);
    expect(after.availableToSpendMinor).toBe(100_000n);
    expect(after.totalAllocatedMinor).toBe(100_000n);
  });

  it("uses reconciled income and surfaces a planning conflict when real income is lower", () => {
    const result = calculateAvailableToSpend(
      makeInput({
        fundingState: "reconciled",
        expectedIncomeMinor: 100_000n,
        reconciledIncomeMinor: 90_000n,
      }),
    );

    expect(result.effectiveIncomeMinor).toBe(90_000n);
    expect(result.unassignedMinor).toBe(-10_000n);
    expect(result.hasPlanningConflict).toBe(true);
    expect(result.planningConflictMinor).toBe(10_000n);
    expect(result.availableToSpendMinor).toBe(90_000n);
  });

  it("keeps extra reconciled income unassigned until the user gives it a purpose", () => {
    const result = calculateAvailableToSpend(
      makeInput({
        fundingState: "reconciled",
        expectedIncomeMinor: 100_000n,
        reconciledIncomeMinor: 110_000n,
      }),
    );

    expect(result.unassignedPositiveMinor).toBe(10_000n);
    expect(result.availableToSpendMinor).toBe(100_000n);
  });

  it("rejects unbalanced reallocations", () => {
    expect(() =>
      calculateAvailableToSpend(
        makeInput({
          budgets: [
            {
              id: "free",
              spendability: "spendable",
              plannedMinor: 100_000n,
              reallocationsOutMinor: 10_000n,
            },
          ],
        }),
      ),
    ).toThrowError(DomainInvariantError);
  });

  it("rejects a reconciled plan without reconciled income", () => {
    expect(() =>
      calculateAvailableToSpend(
        makeInput({
          fundingState: "reconciled",
        }),
      ),
    ).toThrowError(DomainInvariantError);
  });
});
