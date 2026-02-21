\# BeautyNest  

\## Project Proposal (Draft)



\*\*Course:\*\* CISC 4900  

\*\*Section:\*\* VC1A  



---



\## Project Supervisor

\*\*Priyanka Samanta\*\*  

Email: samanta@brooklyn.cuny.edu  



---



\## Team Members



\- \*\*Jiexian He\*\* – Frontend Lead  

\- \*\*Zhihui Gan\*\* – Database \& Backend Support  

\- \*\*Shaoru Wu-Zhu\*\* – Documentation \& Coordination  



---



\# 1. Project Overview



BeautyNest is a lightweight e-commerce website designed for selling essential oil jewelry and handcrafted products created by the business itself.



The goal of this project is to develop a full-stack web application that demonstrates integration between frontend, backend, and database systems within a 14-week semester timeline.



The platform models a small-scale online store where all products are managed internally rather than retrieved from third-party sources.



---



\# 2. Initial Scope (MVP Definition)



At this early stage, we define the following Minimum Viable Product (MVP):



\## 2.1 Customer-Side Features



\- Homepage with product categories  

\- Product catalog page  

\- Product detail view  

\- Keyword-based search functionality  

\- Shopping cart (session-based)  

\- Simplified checkout flow  

\- User login (Google OAuth planned)  

\- Order confirmation page  

\- Basic order history page  



\## 2.2 Admin Features (Planned)



\- Admin login (role-based access control)  

\- Product creation and updates  

\- Order viewing interface  



The scope may be refined based on development progress and supervisor feedback.



---



\# 3. System Architecture (High-Level Design)



The system follows a standard three-tier architecture:



\## 3.1 Frontend (UI Layer)



\- Built with HTML, CSS, and JavaScript  

\- Responsible for rendering product listings and handling user interactions  

\- Communicates with backend via RESTful API calls (JSON format)  



\## 3.2 Backend (Application Layer)



Built using Node.js and Express.js.  



Handles:



\- Authentication (Google OAuth planned)  

\- Role-based access control  

\- Product APIs  

\- Order creation and management  

\- Checkout logic  



\## 3.3 Database (Data Layer)



A relational database (MySQL or PostgreSQL – planned) will store:



\- Users  

\- Products  

\- Orders  

\- Order Items  



All product information will be stored and managed locally in the system database, since the platform represents a small business selling proprietary products.



No external product API integration is required.



---



\# 4. Preliminary Key Workflows



\## 4.1 Product Browsing Workflow



1\. User opens the catalog page  

2\. Frontend sends request to backend  

3\. Backend retrieves product data from the database  

4\. Product list is dynamically rendered on the frontend  



---



\## 4.2 Search Workflow



1\. User enters keyword  

2\. Frontend sends: GET/api/products?query=keyword

3\. Backend filters products from the database  

4\. Filtered results are returned as JSON  

5\. Frontend displays search results  



---



\## 4.3 Checkout Workflow (Simplified)



1\. User adds products to the cart  

2\. Cart state is stored in the session  

3\. User clicks checkout  

4\. Backend creates a pending order record  

5\. Stripe API integration is planned for payment simulation  

6\. Order status is updated after simulated confirmation  



---



\# 5. Tools \& Technologies (Tentative)



\- HTML5 / CSS3 / JavaScript  

\- Node.js + Express.js  

\- Passport.js (Google OAuth – planned)  

\- Stripe API (planned for checkout simulation)  

\- MySQL / PostgreSQL (planned)  

\- Git \& GitHub for version control  

\- Zoom \& Discord for team communication  



Tools may be adjusted as development progresses.



---



\# 6. Team Responsibilities (Initial Division)



\- \*\*Frontend Lead:\*\* UI implementation and user interface integration  

\- \*\*Database \& Backend Support:\*\* Schema design and backend APIs  

\- \*\*Documentation \& Coordination:\*\* Repository setup, workflow tracking, integration support  



All members will collaborate during the integration and testing phases.



---



\# 7. Development Timeline (Preliminary Estimate)



| Weeks |Tasks				 |

|-------|--------------------------------|

|   4–5   | UI \& Authentication                       |

|   6–7   | Product \& Database Integration |

|   8–9   | Cart \& Order System                       |

|  10–11 | Payment \& Admin Features             |

|  12–15 | Testing \& Finalization                 |



The timeline may be refined as development continues.



---



\# 8. Conclusion



This proposal outlines the initial concept, architecture, and scope of BeautyNest.



The project focuses on building a realistic small-scale e-commerce system using internally managed product data and a clean full-stack structure.



Further refinements will be made as development progresses and feedback is received.

