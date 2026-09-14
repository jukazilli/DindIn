import { z } from "zod";

/**
 * Money crosses JSON boundaries as a base-10 integer string.
 * Example: R$ 512,34 => "51234".
 * The API converts this value to bigint inside the domain/database boundary.
 */
export const MoneyMinorSchema = z
  .string()
  .regex(/^\d+$/, "amountMinor must be a non-negative integer string");

export const PositiveMoneyMinorSchema = z
  .string()
  .regex(/^[1-9]\d*$/, "amountMinor must be a positive integer string");

export const SignedMoneyMinorSchema = z
  .string()
  .regex(/^-?\d+$/, "amountMinor must be an integer string");

export const CurrencyCodeSchema = z
  .string()
  .regex(/^[A-Z]{3}$/, "currency must use ISO-4217 style code");

export type MoneyMinor = z.infer<typeof MoneyMinorSchema>;
export type SignedMoneyMinor = z.infer<typeof SignedMoneyMinorSchema>;
export type CurrencyCode = z.infer<typeof CurrencyCodeSchema>;
