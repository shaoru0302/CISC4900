Database (BeautyNest) - MySQL

Schema:
- Run: database/schema/schema.sql

Seed data:
- Run: database/seed/seed_products_dummyjson_100.sql

Verify:
USE beautynest;
SHOW TABLES;
SELECT COUNT(*) FROM products;
SELECT id, name, price, stock FROM products LIMIT 5;

Search example:
SELECT id, name, price, image_url
FROM products
WHERE name LIKE '%keyword%' OR description LIKE '%keyword%'
LIMIT 20;