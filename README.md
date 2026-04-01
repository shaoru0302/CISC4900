# BeautyNest E-commerce Website Project



BeautyNest is a lightweight full-stack e-commerce website designed for selling essential oil jewelry and handcrafted products created by the business itself.

The system demonstrates frontend, backend, and database integration within a semester-long capstone project.


---


## Team Members & Responsibilities

- **Jiexian He - Frontend development**
  - UI Design, Product Listing Interface, User Interaction, Frontend Layout, Styling, and Page Integration
  
- **Zhihui Gan - Database design & Backend**
  - Database Design, Product APIs, Product Detail Page, Order Data Storage, Payment Integration
  
- **Shaoru Wu-Zhu - Backend Development**
  - Authentication, Search Functionality, Cart Logic, Order Processing, Admin Features
  - Diagram design, Documentation, Repository Management & Project Delivery


### Testing & Debugging

- Conducted collaboratively across all team members
- Each member tests their own components
- Integration testing ensures full system functionality


---


## Features (MVP)

- Product catalog and category pages

- Product detail view

- Keyword search

- Shopping cart

- User login (authentication)

- Order creation

- SQL-based product database (internally managed)


---


## System Architecture

The system follows a three-layer architecture:

User Browser → Frontend (HTML / CSS / JavaScript) → Backend API → SQL Database

Additional integrations include:

* Google OAuth authentication
* Stripe checkout workflow (planned)

System architecture detailed overview documentation are avaliable in:
```
docs/architecture.md
```

System architecture and workflow diagrams are available in:

```
docs/diagrams
```

---

## Database Design

The project uses a relational database to manage the e-commerce data.

Core tables include:

* Users
* Products
* Orders
* Order_Items

The database schema supports user authentication, product management, and order creation.

---

## Project Status

The project is currently under active development.

### Completed:

* Google OAuth authentication prototype
* Product keyword search feature
* Initial database schema implementation
* System architecture diagrams

### In progress:

* Expanding product database
* Product detail page improvements
* Checkout workflow

See the weekly development log for detailed updates:

```
docs/weekly_progress.md
```

---

## Installation & Execution Instructions

### Clone the repository and install the required dependencies:
git clone **repository_url**

cd BeautyNest

npm install

```
Create a `.env` file in the project root and configure the required environment variables:
```

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

SESSION_SECRET=your_session_secret

PORT=4900


### Start the server:
cd backend

node src/app.js

```
Then open a browser and visit `http://localhost:4900` to access the BeautyNest website.
```

Users can log in using Google OAuth and test features such as product browsing and keyword search.


---


## Product seed data

The product seed file is located at:

`database/seed/beautynest_products.csv`

Import this CSV into the `products` table using MySQL Workbench Table Data Import Wizard.

The `products` table includes a `category` field for catalog grouping:

- necklace
- earrings
- bracelet
- oil & Accessories


