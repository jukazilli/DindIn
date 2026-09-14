import { z } from "zod";
import { CurrencyCodeSchema } from "./money";

export const UuidSchema = z.string().uuid();

export const AccountTypeSchema = z.enum([
  "checking",
  "savings",
  "cash",
  "wallet",
  "credit_card",
  "other",
]);

export const CategoryKindSchema = z.enum(["income", "expense", "transfer"]);

export const CreateProfileSchema = z.object({
  name: z.string().trim().min(1).max(120),
  locale: z.string().trim().min(2).max(20).default("pt-BR"),
  timezone: z.string().trim().min(1).max(100).default("America/Sao_Paulo"),
  defaultCurrency: CurrencyCodeSchema.default("BRL"),
  financialMonthDay: z.number().int().min(1).max(28).nullable().optional(),
});

export const CreateFinancialAccountSchema = z.object({
  id: UuidSchema.optional(),
  name: z.string().trim().min(1).max(120),
  accountType: AccountTypeSchema,
  currency: CurrencyCodeSchema.default("BRL"),
  includeInNetCash: z.boolean().default(true),
});

export const CreateCategorySchema = z.object({
  id: UuidSchema.optional(),
  name: z.string().trim().min(1).max(80),
  categoryKind: CategoryKindSchema,
  parentId: UuidSchema.nullable().optional(),
  iconKey: z.string().trim().min(1).max(80).nullable().optional(),
});

export type CreateProfileInput = z.infer<typeof CreateProfileSchema>;
export type CreateFinancialAccountInput = z.infer<typeof CreateFinancialAccountSchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
