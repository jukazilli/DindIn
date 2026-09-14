import { sql } from "drizzle-orm";
import {
  bigint,
  char,
  check,
  index,
  integer,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { categories, profiles } from "./core";

export const monthlyPlans = pgTable(
  "monthly_plans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.userId, { onDelete: "restrict" }),
    periodYear: smallint("period_year").notNull(),
    periodMonth: smallint("period_month").notNull(),
    status: text("status").notNull().default("draft"),
    fundingState: text("funding_state").notNull().default("projected"),
    expectedIncomeMinor: bigint("expected_income_minor", { mode: "bigint" }).notNull(),
    reconciledIncomeMinor: bigint("reconciled_income_minor", { mode: "bigint" }),
    unassignedCarryInMinor: bigint("unassigned_carry_in_minor", { mode: "bigint" })
      .notNull()
      .default(0n),
    currency: char("currency", { length: 3 }).notNull().default("BRL"),
    activatedAt: timestamp("activated_at", { withTimezone: true }),
    closedAt: timestamp("closed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    version: integer("version").notNull().default(1),
  },
  (table) => [
    uniqueIndex("monthly_plans_user_period_uq").on(table.userId, table.periodYear, table.periodMonth),
    index("monthly_plans_user_status_idx").on(table.userId, table.status),
    check("monthly_plans_month_check", sql`${table.periodMonth} BETWEEN 1 AND 12`),
    check("monthly_plans_year_check", sql`${table.periodYear} BETWEEN 2000 AND 2200`),
    check("monthly_plans_status_check", sql`${table.status} IN ('draft','active','closed')`),
    check(
      "monthly_plans_funding_state_check",
      sql`${table.fundingState} IN ('projected','reconciled')`,
    ),
    check("monthly_plans_expected_income_check", sql`${table.expectedIncomeMinor} >= 0`),
    check(
      "monthly_plans_reconciled_income_check",
      sql`${table.reconciledIncomeMinor} IS NULL OR ${table.reconciledIncomeMinor} >= 0`,
    ),
    check("monthly_plans_carry_in_check", sql`${table.unassignedCarryInMinor} >= 0`),
    check(
      "monthly_plans_reconciled_state_value_check",
      sql`(${table.fundingState} = 'projected' AND ${table.reconciledIncomeMinor} IS NULL) OR (${table.fundingState} = 'reconciled' AND ${table.reconciledIncomeMinor} IS NOT NULL)`,
    ),
    check("monthly_plans_version_check", sql`${table.version} >= 1`),
  ],
);

export const budgetDefinitions = pgTable(
  "budget_definitions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.userId, { onDelete: "restrict" }),
    name: text("name").notNull(),
    budgetKind: text("budget_kind").notNull(),
    spendability: text("spendability").notNull(),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "restrict" }),
    rolloverMode: text("rollover_mode").notNull().default("none"),
    isActive: text("is_active").notNull().default("true"),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    version: integer("version").notNull().default(1),
  },
  (table) => [
    index("budget_definitions_user_kind_idx").on(table.userId, table.budgetKind),
    check(
      "budget_definitions_kind_check",
      sql`${table.budgetKind} IN ('obligation','consumption','reserve','future_need','goal','free')`,
    ),
    check(
      "budget_definitions_spendability_check",
      sql`${table.spendability} IN ('spendable','protected')`,
    ),
    check(
      "budget_definitions_rollover_check",
      sql`${table.rolloverMode} IN ('none','positive_only','full')`,
    ),
    check("budget_definitions_active_check", sql`${table.isActive} IN ('true','false')`),
    check("budget_definitions_version_check", sql`${table.version} >= 1`),
  ],
);

export const budgetPeriods = pgTable(
  "budget_periods",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.userId, { onDelete: "restrict" }),
    monthlyPlanId: uuid("monthly_plan_id")
      .notNull()
      .references(() => monthlyPlans.id, { onDelete: "restrict" }),
    budgetDefinitionId: uuid("budget_definition_id")
      .notNull()
      .references(() => budgetDefinitions.id, { onDelete: "restrict" }),
    plannedMinor: bigint("planned_minor", { mode: "bigint" }).notNull(),
    carriedInMinor: bigint("carried_in_minor", { mode: "bigint" }).notNull().default(0n),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    version: integer("version").notNull().default(1),
  },
  (table) => [
    uniqueIndex("budget_periods_plan_definition_uq").on(
      table.monthlyPlanId,
      table.budgetDefinitionId,
    ),
    index("budget_periods_user_plan_idx").on(table.userId, table.monthlyPlanId),
    check("budget_periods_planned_check", sql`${table.plannedMinor} >= 0`),
    check("budget_periods_carry_check", sql`${table.carriedInMinor} >= 0`),
    check("budget_periods_version_check", sql`${table.version} >= 1`),
  ],
);

export const budgetReallocations = pgTable(
  "budget_reallocations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.userId, { onDelete: "restrict" }),
    monthlyPlanId: uuid("monthly_plan_id")
      .notNull()
      .references(() => monthlyPlans.id, { onDelete: "restrict" }),
    fromBudgetPeriodId: uuid("from_budget_period_id")
      .notNull()
      .references(() => budgetPeriods.id, { onDelete: "restrict" }),
    toBudgetPeriodId: uuid("to_budget_period_id")
      .notNull()
      .references(() => budgetPeriods.id, { onDelete: "restrict" }),
    amountMinor: bigint("amount_minor", { mode: "bigint" }).notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("budget_reallocations_plan_created_idx").on(table.monthlyPlanId, table.createdAt),
    check("budget_reallocations_amount_check", sql`${table.amountMinor} > 0`),
    check(
      "budget_reallocations_distinct_periods_check",
      sql`${table.fromBudgetPeriodId} <> ${table.toBudgetPeriodId}`,
    ),
  ],
);
