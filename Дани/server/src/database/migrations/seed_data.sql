-- Insert categories
INSERT INTO category (categoryname) VALUES
('Футбол'),
('Баскетбол'),
('Теннис'),
('Фитнес'),
('Бег'),
('Плавание');

-- Insert products
INSERT INTO product (productname, description, price, image_url, categoryid) VALUES
('Футбольный мяч', 'Профессиональный футбольный мяч', 2999.99, '/images/football.jpg', 1),
('Футбольные бутсы', 'Бутсы для футбола', 4999.99, '/images/boots.jpg', 1),
('Футбольная форма', 'Комплект футбольной формы', 3999.99, '/images/kit.jpg', 1),
('Баскетбольный мяч', 'Профессиональный баскетбольный мяч', 2499.99, '/images/basketball.jpg', 2),
('Баскетбольные кроссовки', 'Кроссовки для баскетбола', 5999.99, '/images/basketball_shoes.jpg', 2),
('Теннисная ракетка', 'Профессиональная теннисная ракетка', 7999.99, '/images/tennis_racket.jpg', 3),
('Теннисные мячи', 'Набор теннисных мячей', 999.99, '/images/tennis_balls.jpg', 3),
('Гантели', 'Набор гантелей', 1999.99, '/images/dumbbells.jpg', 4),
('Скакалка', 'Профессиональная скакалка', 499.99, '/images/jump_rope.jpg', 4),
('Беговые кроссовки', 'Кроссовки для бега', 6999.99, '/images/running_shoes.jpg', 5),
('Спортивные часы', 'Умные часы для бега', 8999.99, '/images/sports_watch.jpg', 5),
('Плавательные очки', 'Профессиональные очки для плавания', 1499.99, '/images/swim_goggles.jpg', 6),
('Плавательная шапочка', 'Шапочка для плавания', 499.99, '/images/swim_cap.jpg', 6);

-- Insert stores
INSERT INTO store (storename, address, phone) VALUES
('SportMarket Center', 'ул. Центральная, 1', '+7 (999) 111-22-33'),
('SportMarket North', 'ул. Северная, 10', '+7 (999) 444-55-66'),
('SportMarket South', 'ул. Южная, 20', '+7 (999) 777-88-99');

-- Insert stock
INSERT INTO stock (product_id, store_id, quantity) VALUES
(1, 1, 10), (1, 2, 15), (1, 3, 20),
(2, 1, 8), (2, 2, 12), (2, 3, 10),
(3, 1, 15), (3, 2, 20), (3, 3, 25),
(4, 1, 12), (4, 2, 18), (4, 3, 15),
(5, 1, 10), (5, 2, 15), (5, 3, 12),
(6, 1, 8), (6, 2, 10), (6, 3, 8),
(7, 1, 20), (7, 2, 25), (7, 3, 30),
(8, 1, 15), (8, 2, 20), (8, 3, 18),
(9, 1, 25), (9, 2, 30), (9, 3, 25),
(10, 1, 10), (10, 2, 15), (10, 3, 12),
(11, 1, 8), (11, 2, 10), (11, 3, 8),
(12, 1, 15), (12, 2, 20), (12, 3, 18),
(13, 1, 20), (13, 2, 25), (13, 3, 22);

-- Insert purchase statuses
INSERT INTO purchase_status (statusname) VALUES
('Ожидает подтверждения'),
('Подтвержден'),
('В пути'),
('Доставлен'),
('Отменен');

-- Insert users
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@sportmarket.com', '$2b$10$your_hashed_password', 'admin'),
('manager1', 'manager1@sportmarket.com', '$2b$10$your_hashed_password', 'manager'),
('manager2', 'manager2@sportmarket.com', '$2b$10$your_hashed_password', 'manager'),
('user1', 'user1@example.com', '$2b$10$your_hashed_password', 'user'),
('user2', 'user2@example.com', '$2b$10$your_hashed_password', 'user'); 