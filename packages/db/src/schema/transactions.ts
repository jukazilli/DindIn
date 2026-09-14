import { sql } from "drizzle-orm";
import {
  bigint,
  char,
  check,
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { categories, financialAccounts, profiles } from "./core";
import { budgetPeriods } from "./planning";

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.userId, { onDelete: "restrict" }),
    transactionType: text("transaction_type").notNull(),
    status: text("status").notNull().default("posted"),
    amountMinor: bigint("amount_minor", { mode: "bigint" }).notNull(),
    currency: char("currency", { length: 3 }).notNull().default("BRL"),
    description: text("description"),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "restrict" }),
    sourceAccountId: uuid("source_account_id").references(() => financialAccounts.id, {
      onDelete: "restrict",
    }),
    destinationAccountId: uuid("destination_account_id").references(() => financialAccounts.id, {
      onDelete: "restrict",
    }),
    budgetPeriodId: uuid("budget_period_id").references(() => budgetPeriods.id, {
      onDelete: "restrict",
    }),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    localDate: date("local_date").notNull(),
    sourceType: text("source_type").notNull().default("manual"),
    externalReference: text("external_reference"),
    notes: text("notes"),
    voidedAt: timestamp("voided_at", { withTimezone: true }),
    voidReason: text("void_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    version: integer("version").notNull().default(1),
  },
  (table) => [
    index("transactions_user_local_date_idx").on(table.userId, table.localDate),
    index("transactions_user_status_type_idx").on(table.userId, table.status, table.transactionType),
    index("transactions_budget_period_idx").on(table.budgetPeriodId),
    index("transactions_source_account_idx").on(table.sourceAccountId, table.localDate),
    index("transactions_destination_account_idx").on(table.destinationAccountId, table.localDate),
    check(
      "transactions_type_check",
      sql`${table.transactionType} IN ('income','expense','transfer')`,
    ),
    check("transactions_status_check", sql`${table.status} IN ('pending','posted','voided')`),
    check(
      "transactions_source_type_check",
      sql`${table.sourceType} IN ('manual','recurring','installment','import','integration','system')`,
    ),
    check("transactions_amount_check", sql`${table.amountMinor} > 0`),
    check("transactions_version_check", sql`${table.version} >= 1`),
    check(
      "transactions_transfer_accounts_check",
      sql`${table.transactionType} <> 'transfer' OR (${table.sourceAccountId} IS NOT NULL AND ${table.destinationAccountId} IS NOT NULL AND ${table.sourceAccountId} <> ${table.destinationAccountId})`,
    ),
    check(
      "transactions_void_fields_check",
      sql`(${table.status} = 'voided' AND ${table.voidedAt} IS NOT NULL) OR (${table.status} <> 'voided' AND ${table.voidedAt} IS NULL)`,
    ),
  ],
);
