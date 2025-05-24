-- Удаляем существующие внешние ключи
ALTER TABLE Supply DROP CONSTRAINT IF EXISTS supply_storeid_fkey;
ALTER TABLE Sale DROP CONSTRAINT IF EXISTS sale_storeid_fkey;
ALTER TABLE Request DROP CONSTRAINT IF EXISTS request_storeid_fkey;
ALTER TABLE Report DROP CONSTRAINT IF EXISTS report_store_id_fkey;

-- Добавляем новые внешние ключи с ON DELETE CASCADE
ALTER TABLE Supply ADD CONSTRAINT supply_storeid_fkey 
    FOREIGN KEY (StoreID) REFERENCES Store(StoreID) ON DELETE CASCADE;

ALTER TABLE Sale ADD CONSTRAINT sale_storeid_fkey 
    FOREIGN KEY (StoreID) REFERENCES Store(StoreID) ON DELETE CASCADE;

ALTER TABLE Request ADD CONSTRAINT request_storeid_fkey 
    FOREIGN KEY (StoreID) REFERENCES Store(StoreID) ON DELETE CASCADE;

ALTER TABLE Report ADD CONSTRAINT report_store_id_fkey 
    FOREIGN KEY (store_id) REFERENCES Store(StoreID) ON DELETE CASCADE; 