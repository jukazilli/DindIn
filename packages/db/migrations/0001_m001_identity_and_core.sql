CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS profiles (
  user_id uuid PRIMARY KEY,
  name text NOT NULL,
  locale text NOT NULL DEFAULT 'pt-BR',
  timezone text NOT NULL DEFAULT 'America/Sao_Paulo',
  default_currency char(3) NOT NULL DEFAULT 'BRL',
  financial_month_day smallint,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1,
  CONSTRAINT profiles_financial_month_day_check CHECK (financial_month_day IS NULL OR financial_month_day BETWEEN 1 AND 28),
  CONSTRAINT profiles_version_check CHECK (version >= 1)
);

CREATE TABLE IF NOT EXISTS financial_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE RESTRICT,
  name text NOT NULL,
  account_type text NOT NULL,
  currency char(3) NOT NULL DEFAULT 'BRL',
  include_in_net_cash boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1,
  CONSTRAINT financial_accounts_type_check CHECK (account_type IN ('checking','savings','cash','wallet','credit_card','other')),
  CONSTRAINT financial_accounts_version_check CHECK (version >= 1)
);

CREATE INDEX IF NOT EXISTS financial_accounts_user_active_idx
  ON financial_accounts(user_id, is_active);

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE RESTRICT,
  name text NOT NULL,
  category_kind text NOT NULL,
  parent_id uuid REFERENCES categories(id) ON DELETE RESTRICT,
  icon_key text,
  is_system boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1,
  CONSTRAINT categories_kind_check CHECK (category_kind IN ('income','expense','transfer')),
  CONSTRAINT categories_parent_not_self_check CHECK (parent_id IS NULL OR parent_id <> id),
  CONSTRAINT categories_version_check CHECK (version >= 1)
);

CREATE INDEX IF NOT EXISTS categories_user_kind_active_idx
  ON categories(user_id, category_kind, is_active);
