## Architecture Overview

This project separates responsibilities between frontend and backend:

### Backend (Node.js / Express)
- Handles authentication (Google OAuth)
- Provides API endpoints (e.g. search, user info)
- Serves static frontend files

### Frontend (JavaScript)
- Manages shopping cart using localStorage
- Handles UI rendering and interactions
- Sends data to backend only during checkout

### Design Rationale
- Using localStorage for cart improves responsiveness
- Reduces unnecessary backend requests during browsing
- Keeps the system lightweight and suitable for a course project