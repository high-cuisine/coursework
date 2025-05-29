-- Create PurchaseStatus table
CREATE TABLE IF NOT EXISTS purchase_status (
    statusid SERIAL PRIMARY KEY,
    statusname VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default statuses
INSERT INTO purchase_status (statusname) VALUES
    ('Pending'),
    ('Approved'),
    ('Rejected'),
    ('Completed'),
    ('Cancelled')
ON CONFLICT (statusname) DO NOTHING; 