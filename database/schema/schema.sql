CREATE DATABASE IF NOT EXISTS beautynest
	DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;
    
USE beautynest;


CREATE TABLE IF NOT EXISTS users(
	id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_products_name (name)
);

CREATE TABLE IF NOT EXISTS orders(
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status ENUM('pending','paid','shipped','cancelled') NOT NULL DEFAULT 'pending',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
		ON DELETE RESTRICT
		ON UPDATE CASCADE,
    
    INDEX idx_orders_user_id (user_id)
);

CREATE TABLE IF NOT EXISTS order_items(
	id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price_snapshot DECIMAL(10,2) NOT NULL,
    name_snapshot VARCHAR(255) NOT NULL,
    
    FOREIGN KEY (order_id) REFERENCES orders(id)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
        
	FOREIGN KEY (product_id) REFERENCES products(id)
		ON DELETE RESTRICT
        ON UPDATE CASCADE,
        
    INDEX idx_order_items_order_id (order_id),
    INDEX idx_order_items_product_id (product_id)
);

SHOW TABLES;

INSERT INTO products (name, description, price, stock, image_url) VALUES

('Dragonfly Essential Oil Necklace','Lava Rocks, 24 Inch Chain',119,10,'images/N1.jpg'),
('Lotus Essential Oil Necklace','Lava Rocks, 24 Inch Chain',125,10,'images/N2.jpg'),
('Heart Essential Oil Necklace','Lava Rocks, 24 Inch Chain',108,10,'images/N3.jpg'),

('Filigree Essential Oil Earring','Width 12 millimeters',68,15,'images/E1.jpg'),
('Heart Essential Oil Earring','Width 12 millimeters',98,15,'images/E2.jpg'),
('Flower Essential Oil Earring','Width 12 millimeters',88,15,'images/E3.jpg'),

('Clouds Essential Oil Bracelet','25mm Diffuser Locket',38,20,'images/B1.jpg'),
('Flower Essential Oil Bracelet','25mm Diffuser Locket',28.99,20,'images/B2.jpg'),
('Tree Essential Oil Bracelet','25mm Diffuser Locket',29.99,20,'images/B3.jpg'),

('Cherry Bloom Press on Nails','3D Floral Almond Press-On Nails Pink & Red',25.99,30,'images/Na1.jpg'),
('Ocean Breeze Press on Nails','3D Floral Almond Press-On Nails Blue & White',28.99,30,'images/Na2.jpg'),
('Golden Petals Press on Nails','3D Floral Almond Press-On Nails Orange & Pink',29.99,30,'images/Na3.jpg');
