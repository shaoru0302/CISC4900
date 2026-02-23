# Database (BeautyNest)

## Purpose
This folder contains seed data and database-related resources for the BeautyNest e-commerce project.

## Seed Data
- DummyJSON product seed (100 items): database/seed/dummyjson-products-100.json
- DummyJSON category list: database/seed/dummyjson-categories.json

## Next Steps
- Define schema under database/schema/ (tables, constraints, indexes)
- Add import scripts to load seed JSON into MySQL

---

## Database Setup (MySQL)

### Create schema
Run schema: database/schema/schema.sql in MySQL Workbench.

### Seed products (100 items)
Run seed: database/seed/seed_products_dummyjson_100.sql.

### Verify
USE beautynest;
SHOW TABLES;
SELECT COUNT(*) FROM products;
SELECT id, name, price, stock FROM products LIMIT 5;

## Next Steps
- Import/confirm 100 products in MySQL (done).
- Add a simple search query example for frontend (name/description LIKE) (done).
- (Later) Decide cart storage approach (DB cart tables vs temporary cart).