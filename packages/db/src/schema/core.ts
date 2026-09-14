import { sql } from "drizzle-orm";
import {
  boolean,
  char,
  check,
  index,
  integer,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

export const profiles = pgTable(
  "profiles",
  {
    userId: uuid("user_id").primaryKey(),
    name: text("name").notNull(),
    locale: text("locale").notNull().default("pt-BR"),
    timezone: text("timezone").notNull().default("America/Sao_Paulo"),
    defaultCurrency: char("default_currency", { length: 3 }).notNull().default("BRL"),
    financialMonthDay: smallint("financial_month_day"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    version: integer("version").notNull().default(1),
  },
  (table) => [
    check(
      "profiles_financial_month_day_check",
      sql`${table.financialMonthDay} IS NULL OR ${table.financialMonthDay} BETWEEN 1 AND 28`,
    ),
    check("profiles_version_check", sql`${table.version} >= 1`),
  ],
);

export const financialAccounts = pgTable(
  "financial_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.userId, { onDelete: "restrict" }),
    name: text("name").notNull(),
    accountType: text("account_type").notNull(),
    currency: char("currency", { length: 3 }).notNull().default("BRL"),
    includeInNetCash: boolean("include_in_net_cash").notNull().default(true),
    isActive: boolean("is_active").notNull().default(true),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    version: integer("version").notNull().default(1),
  },
  (table) => [
    check(
      "financial_accounts_type_check",
      sql`${table.accountType} IN ('checking','savings','cash','wallet','credit_card','other')`,
    ),
    check("financial_accounts_version_check", sql`${table.version} >= 1`),
    index("financial_accounts_user_active_idx").on(table.userId, table.isActive),
  ],
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.userId, { onDelete: "restrict" }),
    name: text("name").notNull(),
    categoryKind: text("category_kind").notNull(),
    parentId: uuid("parent_id").references((): AnyPgColumn => categories.id, {
      onDelete: "restrict",
    }),
    iconKey: text("icon_key"),
    isSystem: boolean("is_system").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    version: integer("version").notNull().default(1),
  },
  (table) => [
    check(
      "categories_kind_check",
      sql`${table.categoryKind} IN ('income','expense','transfer')`,
    ),
    check("categories_parent_not_self_check", sql`${table.parentId} IS NULL OR ${table.parentId} <> ${table.id}`),
    check("categories_version_check", sql`${table.version} >= 1`),
    index("categories_user_kind_active_idx").on(table.userId, table.categoryKind, table.isActive),
  ],
);
