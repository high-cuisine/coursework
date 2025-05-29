-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create Category table
CREATE TABLE IF NOT EXISTS Category (
    categoryid SERIAL PRIMARY KEY,
    categoryname VARCHAR(100) NOT NULL
);

-- Create Product table
CREATE TABLE IF NOT EXISTS Product (
    productid SERIAL PRIMARY KEY,
    productname VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    categoryid INTEGER REFERENCES Category(categoryid)
);

-- Create Store table
CREATE TABLE IF NOT EXISTS Store (
    storeid SERIAL PRIMARY KEY,
    storename VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20)
);

-- Create Stock table
CREATE TABLE IF NOT EXISTS Stock (
    stock_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES Product(productid),
    store_id INTEGER NOT NULL REFERENCES Store(storeid),
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, store_id)
);

-- Create PurchaseStatus table
CREATE TABLE IF NOT EXISTS PurchaseStatus (
    statusid SERIAL PRIMARY KEY,
    statusname VARCHAR(50) NOT NULL
);

-- Create Purchase table
CREATE TABLE IF NOT EXISTS Purchase (
    purchaseid SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(user_id),
    store_id INTEGER NOT NULL REFERENCES Store(storeid),
    product_id INTEGER NOT NULL REFERENCES Product(productid),
    quantity INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status_id INTEGER NOT NULL REFERENCES PurchaseStatus(statusid),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_stock_updated_at
    BEFORE UPDATE ON Stock
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_updated_at
    BEFORE UPDATE ON Purchase
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 