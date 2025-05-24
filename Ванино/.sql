-- Филиалы банка
CREATE TABLE branch (
    branch_id  SERIAL PRIMARY KEY,
    name       TEXT NOT NULL
);

-- Юридические лица (текущая сущность организации)
CREATE TABLE organization (
    org_id     SERIAL PRIMARY KEY,
    name       TEXT NOT NULL
);

-- Версии реквизитов организации
CREATE TABLE organization_rev (
    rev_id     SERIAL PRIMARY KEY,
    org_id     INTEGER NOT NULL REFERENCES organization(org_id) ON DELETE CASCADE,
    name       TEXT NOT NULL,
    inn        VARCHAR(12),
    kpp        VARCHAR(9),
    address    TEXT,
    valid_from DATE NOT NULL,
    valid_to   DATE,
    CHECK (valid_to IS NULL OR valid_to > valid_from)
);

-- Расчётные счета организации
CREATE TABLE account (
    account_no CHAR(20) PRIMARY KEY,
    org_id     INTEGER NOT NULL REFERENCES organization(org_id) ON DELETE CASCADE
);

-- Назначения платежей
CREATE TABLE purpose (
    purpose_id   SERIAL PRIMARY KEY,
    account_no   CHAR(20) NOT NULL REFERENCES account(account_no) ON DELETE CASCADE,
    purpose_name TEXT NOT NULL,
    UNIQUE (account_no, purpose_name)
);

-- Платежи
CREATE TABLE payment (
    payment_id   BIGSERIAL PRIMARY KEY,
    pay_date     DATE NOT NULL,
    branch_id    INTEGER NOT NULL REFERENCES branch(branch_id) ON DELETE RESTRICT,
    purpose_id   INTEGER NOT NULL REFERENCES purpose(purpose_id) ON DELETE RESTRICT,
    payer_name   TEXT NOT NULL,
    amount       NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    org_rev_id   INTEGER NOT NULL REFERENCES organization_rev(rev_id) ON DELETE RESTRICT
);
