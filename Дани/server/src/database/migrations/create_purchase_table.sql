CREATE TABLE IF NOT EXISTS purchase (
    purchaseid SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    store_id INTEGER NOT NULL REFERENCES store(storeid),
    product_id INTEGER NOT NULL REFERENCES product(productid),
    quantity INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status_id INTEGER NOT NULL REFERENCES purchase_status(statusid),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchase_archive (
    archive_id SERIAL PRIMARY KEY,
    purchase_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    store_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    archived_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS PurchaseStatus (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL
);

-- Insert default statuses if they don't exist
INSERT INTO PurchaseStatus (status_name)
SELECT 'Pending'
WHERE NOT EXISTS (SELECT 1 FROM PurchaseStatus WHERE status_name = 'Pending');

INSERT INTO PurchaseStatus (status_name)
SELECT 'Approved'
WHERE NOT EXISTS (SELECT 1 FROM PurchaseStatus WHERE status_name = 'Approved');

INSERT INTO PurchaseStatus (status_name)
SELECT 'Rejected'
WHERE NOT EXISTS (SELECT 1 FROM PurchaseStatus WHERE status_name = 'Rejected');

INSERT INTO PurchaseStatus (status_name)
SELECT 'Completed'
WHERE NOT EXISTS (SELECT 1 FROM PurchaseStatus WHERE status_name = 'Completed'); 