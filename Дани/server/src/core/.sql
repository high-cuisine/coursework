-- 1. Магазины
CREATE TABLE Store (
    StoreID SERIAL PRIMARY KEY,
    StoreName VARCHAR(100) NOT NULL,
    Location TEXT NOT NULL
);

-- 2. Категории товаров
CREATE TABLE Category (
    CategoryID SERIAL PRIMARY KEY,
    CategoryName VARCHAR(100) NOT NULL
);

-- 3. Товары
CREATE TABLE Product (
    ProductID SERIAL PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    CategoryID INT NOT NULL,
    Price DECIMAL(10, 2) NOT NULL CHECK (Price >= 0),
    FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
);

-- 4. Поставки товаров
CREATE TABLE Supply (
    SupplyID SERIAL PRIMARY KEY,
    StoreID INT NOT NULL,
    ProductID INT NOT NULL,
    SupplyDate DATE NOT NULL DEFAULT CURRENT_DATE,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    FOREIGN KEY (StoreID) REFERENCES Store(StoreID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

-- 5. Продажи товаров
CREATE TABLE Sale (
    SaleID SERIAL PRIMARY KEY,
    StoreID INT NOT NULL,
    ProductID INT NOT NULL,
    SaleDate DATE NOT NULL DEFAULT CURRENT_DATE,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    TotalAmount DECIMAL(12, 2) NOT NULL CHECK (TotalAmount >= 0),
    FOREIGN KEY (StoreID) REFERENCES Store(StoreID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

-- 6. Заявки на поставку
CREATE TABLE Request (
    RequestID SERIAL PRIMARY KEY,
    StoreID INT NOT NULL,
    ProductID INT NOT NULL,
    RequestDate DATE NOT NULL DEFAULT CURRENT_DATE,
    RequestedQuantity INT NOT NULL CHECK (RequestedQuantity > 0),
    FOREIGN KEY (StoreID) REFERENCES Store(StoreID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

CREATE TABLE Report (
    report_id SERIAL PRIMARY KEY,
    store_id INT NOT NULL,
    month DATE NOT NULL,
    total_revenue DECIMAL(12, 2) NOT NULL DEFAULT 0,
    FOREIGN KEY (store_id) REFERENCES Store(StoreID) ON DELETE CASCADE
);

-- 7. Users table for authentication
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);
