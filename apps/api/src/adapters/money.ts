export function parseMoneyMinor(value: string): bigint {
  return BigInt(value);
}

export function serializeMoneyMinor(value: bigint): string {
  return value.toString(10);
}
