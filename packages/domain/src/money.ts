import { DomainInvariantError } from "./errors";

export function assertNonNegativeMoney(name: string, value: bigint): void {
  if (value < 0n) {
    throw new DomainInvariantError(
      "NEGATIVE_MONEY",
      `${name} must be greater than or equal to zero`,
    );
  }
}

export function maxZero(value: bigint): bigint {
  return value > 0n ? value : 0n;
}

export function sumMoney(values: Iterable<bigint>): bigint {
  let total = 0n;

  for (const value of values) {
    total += value;
  }

  return total;
}
