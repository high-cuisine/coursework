-- Создаем таблицу users первой, так как на неё есть ссылки
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);

-- Создаем таблицу Department без внешнего ключа на Inspector
CREATE TABLE Department (
    DepartmentID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Address VARCHAR(255),
    Phone VARCHAR(20),
    HeadInspectorID INT -- пока без FK
);

-- Создаем таблицу Inspector без внешнего ключа на Department
CREATE TABLE Inspector (
    InspectorID SERIAL PRIMARY KEY,
    LastName VARCHAR(100) NOT NULL,
    FirstName VARCHAR(100) NOT NULL,
    MiddleName VARCHAR(100),
    Position VARCHAR(100),
    HireDate DATE,
    AccessLevel VARCHAR(50),
    DepartmentID INT, -- пока без FK
    CONSTRAINT fk_user FOREIGN KEY (InspectorID) REFERENCES users(id) ON DELETE CASCADE
);

-- Создаем таблицу Taxpayer
CREATE TABLE Taxpayer (
    TaxpayerID SERIAL PRIMARY KEY,
    Type VARCHAR(20) NOT NULL,
    FullName VARCHAR(255) NOT NULL,
    TaxID VARCHAR(20) NOT NULL,
    RegistrationAddress VARCHAR(255),
    Phone VARCHAR(20),
    Email VARCHAR(100),
    RegistrationDate DATE,
    DepartmentID INT, -- пока без FK
    CONSTRAINT fk_taxpayer_user FOREIGN KEY (TaxpayerID) REFERENCES users(id) ON DELETE SET NULL
);

-- Создаем таблицу Tax
CREATE TABLE Tax (
    TaxID SERIAL PRIMARY KEY,
    TaxCode VARCHAR(20) NOT NULL,
    TaxName VARCHAR(255) NOT NULL,
    Rate DECIMAL(5,2),
    RegulatoryDocument VARCHAR(255),
    Description TEXT,
    TaxType VARCHAR(50)
);

-- Создаем таблицу Violation
CREATE TABLE Violation (
    ViolationID SERIAL PRIMARY KEY,
    ViolationDate DATE NOT NULL,
    ViolationPeriod VARCHAR(20),
    NonPaymentAmount DECIMAL(15,2),
    ViolationDescription TEXT,
    Status VARCHAR(50),
    PaymentOverdue BOOLEAN,
    TaxpayerID INT,
    TaxID INT,
    InspectorID INT
);

-- Создаем таблицу Fine
CREATE TABLE Fine (
    FineID SERIAL PRIMARY KEY,
    FineAmount DECIMAL(15,2) NOT NULL,
    ChargeDate DATE,
    PaymentDeadline DATE,
    PaymentStatus VARCHAR(50),
    PaymentDate DATE,
    ViolationID INT
);

-- Создаем таблицу Property
CREATE TABLE Property (
    PropertyID SERIAL PRIMARY KEY,
    PropertyType VARCHAR(100) NOT NULL,
    TaxpayerID INT
);

-- Добавляем внешние ключи после создания таблиц, чтобы избежать циклических зависимостей

ALTER TABLE Department
  ADD CONSTRAINT fk_headinspector FOREIGN KEY (HeadInspectorID) REFERENCES Inspector(InspectorID) ON DELETE SET NULL;

ALTER TABLE Inspector
  ADD CONSTRAINT fk_department FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID) ON DELETE SET NULL;

ALTER TABLE Taxpayer
  ADD CONSTRAINT fk_taxpayer_department FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID);

ALTER TABLE Violation
  ADD CONSTRAINT fk_violation_taxpayer FOREIGN KEY (TaxpayerID) REFERENCES Taxpayer(TaxpayerID);

ALTER TABLE Violation
  ADD CONSTRAINT fk_violation_tax FOREIGN KEY (TaxID) REFERENCES Tax(TaxID);

ALTER TABLE Violation
  ADD CONSTRAINT fk_violation_inspector FOREIGN KEY (InspectorID) REFERENCES Inspector(InspectorID);

ALTER TABLE Fine
  ADD CONSTRAINT fk_fine_violation FOREIGN KEY (ViolationID) REFERENCES Violation(ViolationID);

ALTER TABLE Property
  ADD CONSTRAINT fk_property_taxpayer FOREIGN KEY (TaxpayerID) REFERENCES Taxpayer(TaxpayerID);

-- Индекс для быстрого поиска по TaxID в Taxpayer
CREATE INDEX idx_taxpayer_taxid ON Taxpayer(TaxID);
