# Backend API Checklist (REST-style)

This document outlines the planned REST-style backend API endpoints for the BeautyNest system. Some endpoints are implemented while others are part of upcoming development milestones.

## Conventions (team-wide)
- Base path agreed (example /api)
- All responses return JSON with success, message, data
- Server recomputes totals, never trusts client price
- Input validation for ids and quantities (non-negative, integer)
- Error codes: 200 success, 400 bad request, 401 unauthorized, 404 not found, 500 server error
- Cart storage decision documented (session-based or database-based)

---

## 1. Products (user-facing)

### GET /api/products
Purpose
- Return product list for catalog browsing and search
Input
- Optional query params: search, category, sort
Output
- List of products: id, name, description, price, stock, category, imageUrl(optional)

Validation
- search length limit
- sort must be whitelisted
Test
- Returns empty list gracefully when no products exist

### GET /api/products/{id}
Purpose
- Return a single product detail page data
Input
- Path param: id
Output
- Product detail: id, name, description, price, stock, category, imageUrl (optional)
Validation
- id must be integer
- Return 404 if not found
Test
- Invalid id returns 400
- Non-existent id returns 404

---

## 2. Cart (user-facing)
### GET /api/cart
Purpose
- Retrieve current cart contents
Output
- Items: productId, name, unitPrice, quantity, lineTotal
- Cart totals: subtotal, total
Validation
- Totals computed server-side
Test
- Empty cart returns empty list + total 0

### POST /api/cart/items
Purpose
- Add item to cart
Input (JSON)
- productId
- quantity
Output
- Updated cart summary
Validation
- Product exists
- Quantity is positive integer
- Quantity does not exceed stock (or allow add but enforce at checkout, choose one and document)
Test
- Add same product twice updates quantity (or returns error, document behavior)

### PATCH /api/cart/items/{productId}
Purpose
- Update quantity of an item in cart
Input (JSON)
- quantity
Output
- Updated cart summary
Validation
- Quantity is integer >= 0
- If quantity = 0, item removed (document behavior)
Test
- Updating non-existent item returns 404 or adds item (choose and document)

### DELETE /api/cart/items/{productId}
Purpose
- Remove an item from cart
Output
- Updated cart summary
Validation
- ProductId must be integer
- Removing an item not in cart handled gracefully
Test
- Cart remains valid after removal

### DELETE /api/cart
Purpose
- Clear the entire cart
Output
- Empty cart confirmation
Test
- Clearing an already empty cart still succeeds

---

## 3. Authentication (Google OAuth)
### GET /auth/google
Purpose
- Redirect user to Google OAuth login
### GET /auth/google/callback
Purpose
- Handle OAuth callback and create/login user session
Output
- Authenticated user session
- Redirect to homepage or admin page or user page after login

---

## 4. Checkout (Simulated payment, planned)
### POST /api/checkout
Purpose
- Simulated checkout that creates an order without real payment
Input (JSON)
- Optional: shipping info fields (only if you include them, otherwise N/A)
Output
- orderId
- Order summary: items + totals
Server Steps (must be implemented)
- Reject empty cart
- Re-fetch products and prices from DB
- Validate stock for each item
- Compute totals server-side
- Create orders record
- Create order_items records
- Decrement stock
- Clear cart
- Return confirmation payload
Consistency
- Use a DB transaction for order + order_items + stock update
Test
- Insufficient stock returns 400 and does not create an order
- Totals match server-computed values

---

## 5. Orders (User view)
### GET /api/orders
Purpose
- Customer views their orders (basic)
Requirement
- Must be logged in
Output
- List: orderId, createdAt, price, status
Test
- Not logged in returns 401

### GET /api/orders/{orderId}
Purpose
- Customer views a single order detail
Requirement
- Must be logged in and owner of the order
Output
- Order header + items
Test
- Accessing another user’s order returns 403

---

## 6. Admin (Minimal dashboard)
### GET /api/admin/orders
Purpose
- Admin views all orders (read-only option for instructor)
Requirement
- Admin login or simple protected access (document approach)
Output
- Order list + optional filters
Test
- Non-admin access returns 401/403

### POST /api/admin/products
Purpose
- Admin adds a product
Input (JSON)
- name, description, price, stock, category
Validation
- price > 0
- stock integer >= 0
Test
- Missing required field returns 400

### PATCH /api/admin/products/{id}
Purpose
- Admin edits product fields
Input (JSON)
- Any subset of product fields
Validation
- Same validation rules as create
Test
- Updating non-existent id returns 404

### DELETE /api/admin/products/{id}
Purpose
- Admin deletes product (optional if you prefer “disable”)
Decision
- Choose delete vs soft-delete and document
Test
- Deleting product referenced in existing order handled safely (soft-delete recommended)

---

## Integration Checklist (must-have before full demo)
- Frontend calls /api/products and renders catalog
- Product detail page calls /api/products/{id}
- Cart buttons call cart endpoints and UI updates correctly
- Checkout calls /api/checkout and shows success page
- Admin can view orders
- Weekly progress updates reflect completed endpoints

