-- Table: Department
CREATE TABLE Department (
    DepartmentID INT SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Address VARCHAR(255),
    Phone VARCHAR(20),
    HeadInspectorID INT,
    FOREIGN KEY (HeadInspectorID) REFERENCES Inspector(InspectorID)
);

-- Table: Inspector
CREATE TABLE Inspector (
    InspectorID INT SERIAL PRIMARY KEY,
    LastName VARCHAR(100) NOT NULL,
    FirstName VARCHAR(100) NOT NULL,
    MiddleName VARCHAR(100),
    Position VARCHAR(100),
    HireDate DATE,
    AccessLevel VARCHAR(50),
    DepartmentID INT,
    FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID) ON DELETE SET NULL,
    FOREIGN KEY (InspectorID) REFERENCES users(id)
);

-- Table: Taxpayer
CREATE TABLE Taxpayer (
    TaxpayerID INT SERIAL PRIMARY KEY,
    Type VARCHAR(20) NOT NULL,
    FullName VARCHAR(255) NOT NULL,
    TaxID VARCHAR(20) NOT NULL,
    RegistrationAddress VARCHAR(255),
    Phone VARCHAR(20),
    Email VARCHAR(100),
    RegistrationDate DATE,
    DepartmentID INT,
    FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID),
    FOREIGN KEY (TaxpayerID) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: Tax
CREATE TABLE Tax (
    TaxID INT SERIAL PRIMARY KEY,
    TaxCode VARCHAR(20) NOT NULL,
    TaxName VARCHAR(255) NOT NULL,
    Rate DECIMAL(5,2),
    RegulatoryDocument VARCHAR(255),
    Description TEXT,
    TaxType VARCHAR(50)
);

-- Table: Violation
CREATE TABLE Violation (
    ViolationID INT SERIAL PRIMARY KEY,
    ViolationDate DATE NOT NULL,
    ViolationPeriod VARCHAR(20),
    NonPaymentAmount DECIMAL(15,2),
    ViolationDescription TEXT,
    Status VARCHAR(50),
    PaymentOverdue BOOLEAN,
    TaxpayerID INT,
    TaxID INT,
    InspectorID INT,
    FOREIGN KEY (TaxpayerID) REFERENCES Taxpayer(TaxpayerID),
    FOREIGN KEY (TaxID) REFERENCES Tax(TaxID),
    FOREIGN KEY (InspectorID) REFERENCES Inspector(InspectorID)
);

-- Table: Fine
CREATE TABLE Fine (
    FineID INT SERIAL PRIMARY KEY,
    FineAmount DECIMAL(15,2) NOT NULL,
    ChargeDate DATE,
    PaymentDeadline DATE,
    PaymentStatus VARCHAR(50),
    PaymentDate DATE,
    ViolationID INT,
    FOREIGN KEY (ViolationID) REFERENCES Violation(ViolationID)
);

-- Table: Property
CREATE TABLE Property (
    PropertyID INT SERIAL PRIMARY KEY,
    PropertyType VARCHAR(100) NOT NULL
    FOREIGN KEY (PropertyID) REFERENCES Taxpayer(TaxpayerID)
);

CREATE TABLE users (
    id INT SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);


CREATE INDEX idx_taxpayer_taxid ON Taxpayer(TaxID)