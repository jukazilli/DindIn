import { z } from "zod";
import { UuidSchema } from "./core";
import { CurrencyCodeSchema, PositiveMoneyMinorSchema } from "./money";

export const TransactionTypeSchema = z.enum(["income", "expense", "transfer"]);
export const TransactionStatusSchema = z.enum(["pending", "posted", "voided"]);
export const TransactionSourceTypeSchema = z.enum([
  "manual",
  "recurring",
  "installment",
  "import",
  "integration",
  "system",
]);

export const CreateTransactionSchema = z
  .object({
    id: UuidSchema.optional(),
    transactionType: TransactionTypeSchema,
    amountMinor: PositiveMoneyMinorSchema,
    currency: CurrencyCodeSchema.default("BRL"),
    description: z.string().trim().max(240).nullable().optional(),
    categoryId: UuidSchema.nullable().optional(),
    sourceAccountId: UuidSchema.nullable().optional(),
    destinationAccountId: UuidSchema.nullable().optional(),
    budgetPeriodId: UuidSchema.nullable().optional(),
    occurredAt: z.string().datetime(),
    localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    sourceType: TransactionSourceTypeSchema.default("manual"),
    externalReference: z.string().trim().max(200).nullable().optional(),
    notes: z.string().trim().max(1000).nullable().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.transactionType === "transfer") {
      if (!value.sourceAccountId || !value.destinationAccountId) {
        ctx.addIssue({
          code: "custom",
          message: "transfers require sourceAccountId and destinationAccountId",
          path: ["sourceAccountId"],
        });
      }
      if (value.sourceAccountId && value.sourceAccountId === value.destinationAccountId) {
        ctx.addIssue({
          code: "custom",
          message: "transfer source and destination must be different",
          path: ["destinationAccountId"],
        });
      }
      if (value.budgetPeriodId) {
        ctx.addIssue({
          code: "custom",
          message: "transfers do not consume a budget period",
          path: ["budgetPeriodId"],
        });
      }
    }
  });

export const VoidTransactionSchema = z.object({
  reason: z.string().trim().min(1).max(240),
  expectedVersion: z.number().int().min(1),
});

export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;
export type VoidTransactionInput = z.infer<typeof VoidTransactionSchema>;
