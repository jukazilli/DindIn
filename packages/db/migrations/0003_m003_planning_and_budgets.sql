CREATE TABLE IF NOT EXISTS monthly_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE RESTRICT,
  period_year smallint NOT NULL,
  period_month smallint NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  funding_state text NOT NULL DEFAULT 'projected',
  expected_income_minor bigint NOT NULL,
  reconciled_income_minor bigint,
  unassigned_carry_in_minor bigint NOT NULL DEFAULT 0,
  currency char(3) NOT NULL DEFAULT 'BRL',
  activated_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1,
  CONSTRAINT monthly_plans_month_check CHECK (period_month BETWEEN 1 AND 12),
  CONSTRAINT monthly_plans_year_check CHECK (period_year BETWEEN 2000 AND 2200),
  CONSTRAINT monthly_plans_status_check CHECK (status IN ('draft','active','closed')),
  CONSTRAINT monthly_plans_funding_state_check CHECK (funding_state IN ('projected','reconciled')),
  CONSTRAINT monthly_plans_expected_income_check CHECK (expected_income_minor >= 0),
  CONSTRAINT monthly_plans_reconciled_income_check CHECK (reconciled_income_minor IS NULL OR reconciled_income_minor >= 0),
  CONSTRAINT monthly_plans_carry_in_check CHECK (unassigned_carry_in_minor >= 0),
  CONSTRAINT monthly_plans_reconciled_state_value_check CHECK (
    (funding_state = 'projected' AND reconciled_income_minor IS NULL)
    OR (funding_state = 'reconciled' AND reconciled_income_minor IS NOT NULL)
  ),
  CONSTRAINT monthly_plans_version_check CHECK (version >= 1)
);

CREATE UNIQUE INDEX IF NOT EXISTS monthly_plans_user_period_uq
  ON monthly_plans(user_id, period_year, period_month);

CREATE INDEX IF NOT EXISTS monthly_plans_user_status_idx
  ON monthly_plans(user_id, status);

CREATE TABLE IF NOT EXISTS budget_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE RESTRICT,
  name text NOT NULL,
  budget_kind text NOT NULL,
  spendability text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE RESTRICT,
  rollover_mode text NOT NULL DEFAULT 'none',
  is_active boolean NOT NULL DEFAULT true,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1,
  CONSTRAINT budget_definitions_kind_check CHECK (budget_kind IN ('obligation','consumption','reserve','future_need','goal','free')),
  CONSTRAINT budget_definitions_spendability_check CHECK (spendability IN ('spendable','protected')),
  CONSTRAINT budget_definitions_rollover_check CHECK (rollover_mode IN ('none','positive_only','full')),
  CONSTRAINT budget_definitions_version_check CHECK (version >= 1)
);

CREATE INDEX IF NOT EXISTS budget_definitions_user_kind_idx
  ON budget_definitions(user_id, budget_kind);

CREATE TABLE IF NOT EXISTS budget_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE RESTRICT,
  monthly_plan_id uuid NOT NULL REFERENCES monthly_plans(id) ON DELETE RESTRICT,
  budget_definition_id uuid NOT NULL REFERENCES budget_definitions(id) ON DELETE RESTRICT,
  planned_minor bigint NOT NULL,
  carried_in_minor bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1,
  CONSTRAINT budget_periods_planned_check CHECK (planned_minor >= 0),
  CONSTRAINT budget_periods_carry_check CHECK (carried_in_minor >= 0),
  CONSTRAINT budget_periods_version_check CHECK (version >= 1)
);

CREATE UNIQUE INDEX IF NOT EXISTS budget_periods_plan_definition_uq
  ON budget_periods(monthly_plan_id, budget_definition_id);

CREATE INDEX IF NOT EXISTS budget_periods_user_plan_idx
  ON budget_periods(user_id, monthly_plan_id);

CREATE TABLE IF NOT EXISTS budget_reallocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE RESTRICT,
  monthly_plan_id uuid NOT NULL REFERENCES monthly_plans(id) ON DELETE RESTRICT,
  from_budget_period_id uuid NOT NULL REFERENCES budget_periods(id) ON DELETE RESTRICT,
  to_budget_period_id uuid NOT NULL REFERENCES budget_periods(id) ON DELETE RESTRICT,
  amount_minor bigint NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT budget_reallocations_amount_check CHECK (amount_minor > 0),
  CONSTRAINT budget_reallocations_distinct_periods_check CHECK (from_budget_period_id <> to_budget_period_id)
);

CREATE INDEX IF NOT EXISTS budget_reallocations_plan_created_idx
  ON budget_reallocations(monthly_plan_id, created_at);

ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS budget_period_id uuid;

ALTER TABLE transactions
  ADD CONSTRAINT transactions_budget_period_id_budget_periods_id_fk
  FOREIGN KEY (budget_period_id)
  REFERENCES budget_periods(id)
  ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS transactions_budget_period_idx
  ON transactions(budget_period_id);
