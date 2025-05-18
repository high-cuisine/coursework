/* филиалы банка */
CREATE TABLE branch (
    branch_id  SERIAL PRIMARY KEY,
    name       TEXT NOT NULL
);

/* юридические лица (актуальные реквизиты) */
CREATE TABLE organization (
    org_id     SERIAL PRIMARY KEY,
    name       TEXT NOT NULL
);

/* версии реквизитов организации  ─ хранит историю изменений   */
/* актуальная версия – та, у которой valid_to IS NULL          */
CREATE TABLE organization_rev (
    rev_id     SERIAL PRIMARY KEY,
    org_id     INT   NOT NULL REFERENCES organization(org_id),
    name       TEXT  NOT NULL,          -- имя/текущее юр.-название
    inn        VARCHAR(12),
    kpp        VARCHAR(9),
    address    TEXT,
    valid_from DATE  NOT NULL,
    valid_to   DATE
);

/* расчётные счета организации */
CREATE TABLE account (
    account_no CHAR(20) PRIMARY KEY,
    org_id     INT NOT NULL REFERENCES organization(org_id)
);

/* назначения платежей (услуги)                                 */
/* одно назначение → максимум один счёт,                        */
/* на один счёт может приходиться много назначений              */
CREATE TABLE purpose (
    purpose_id   SERIAL PRIMARY KEY,
    org_id       INT  NOT NULL REFERENCES organization(org_id),
    account_no   CHAR(20) NOT NULL REFERENCES account(account_no),
    purpose_name TEXT NOT NULL,
    UNIQUE (org_id, purpose_name)          -- исключает дубль услуг
);

/* поступившие платежи                                           */
/* org_rev_id фиксирует исходные реквизиты,                      */
/* а через purpose → account/org_id получаем «обновлённые» данные */
CREATE TABLE payment (
    payment_id   BIGSERIAL PRIMARY KEY,
    pay_date     DATE   NOT NULL,
    branch_id    INT    NOT NULL REFERENCES branch(branch_id),
    purpose_id   INT    NOT NULL REFERENCES purpose(purpose_id),
    payer_name   TEXT   NOT NULL,
    amount       NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    org_rev_id   INT    NOT NULL REFERENCES organization_rev(rev_id)
);
