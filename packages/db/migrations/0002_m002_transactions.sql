CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE RESTRICT,
  transaction_type text NOT NULL,
  status text NOT NULL DEFAULT 'posted',
  amount_minor bigint NOT NULL,
  currency char(3) NOT NULL DEFAULT 'BRL',
  description text,
  category_id uuid REFERENCES categories(id) ON DELETE RESTRICT,
  source_account_id uuid REFERENCES financial_accounts(id) ON DELETE RESTRICT,
  destination_account_id uuid REFERENCES financial_accounts(id) ON DELETE RESTRICT,
  occurred_at timestamptz NOT NULL,
  local_date date NOT NULL,
  source_type text NOT NULL DEFAULT 'manual',
  external_reference text,
  notes text,
  voided_at timestamptz,
  void_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1,
  CONSTRAINT transactions_type_check CHECK (transaction_type IN ('income','expense','transfer')),
  CONSTRAINT transactions_status_check CHECK (status IN ('pending','posted','voided')),
  CONSTRAINT transactions_source_type_check CHECK (source_type IN ('manual','recurring','installment','import','integration','system')),
  CONSTRAINT transactions_amount_check CHECK (amount_minor > 0),
  CONSTRAINT transactions_version_check CHECK (version >= 1),
  CONSTRAINT transactions_transfer_accounts_check CHECK (
    transaction_type <> 'transfer'
    OR (
      source_account_id IS NOT NULL
      AND destination_account_id IS NOT NULL
      AND source_account_id <> destination_account_id
    )
  ),
  CONSTRAINT transactions_void_fields_check CHECK (
    (status = 'voided' AND voided_at IS NOT NULL)
    OR (status <> 'voided' AND voided_at IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS transactions_user_local_date_idx
  ON transactions(user_id, local_date);

CREATE INDEX IF NOT EXISTS transactions_user_status_type_idx
  ON transactions(user_id, status, transaction_type);

CREATE INDEX IF NOT EXISTS transactions_source_account_idx
  ON transactions(source_account_id, local_date);

CREATE INDEX IF NOT EXISTS transactions_destination_account_idx
  ON transactions(destination_account_id, local_date);
