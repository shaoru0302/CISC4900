## Architecture Overview

This project separates responsibilities between frontend and backend:

### Backend (Node.js / Express)
- Handles authentication (Google OAuth)
- Provides API endpoints (e.g. search, user info /api/me)
- Serves static frontend files

### Frontend (JavaScript)
- Manages shopping cart using localStorage
- Handles UI rendering and interactions
- Sends data to backend only during checkout

### Design Rationale
- Using localStorage for cart improves responsiveness
- Reduces unnecessary backend requests during browsing
- Keeps the system lightweight and suitable for a course project scope

### Note
Some frontend-related business logic such as {shopping cart management, order creation(UI-side handling)} are intentionally implemented in frontend JavaScript files(e.g. shopping_cart.js, shopping_cart_page.js).
