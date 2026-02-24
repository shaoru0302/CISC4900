# Project First Meeting Summary  

**Date:** 2026-02-09 

**Time:** 3:00 PM 

**Course:** CISC 4900

**Location:** Room 2122b  

**Team Members:** Jiexian He, Zhihui Gan, Shaoru Wu-Zhu

**Professor:** Priyanka Samanta



---



## 1. Overview



We met with the instructor to refine the project direction and clarify technical expectations for the upcoming development phase. The discussion focused on authentication, data sourcing, search functionality, payment integration, and preparation for the next meeting.



---



## 2. Instructor Recommendations



### 2.1 Authentication \& User Roles



- Implement Google email sign-in using an API.

- Support role-based access control:

&nbsp; - **Admin** → redirected to admin dashboard.

&nbsp; - **User** → redirected to user homepage.

- Users should be able to view their **order history**.



---



### 2.2 Product Data \& Images



- Instead of manually creating all product data, we may reference existing online databases.

- We can write code to fetch and display product information and images dynamically.

- Research reliable public data sources before implementation.



---



### 2.3 Search Feature



- Implement a keyword-based product search feature.

- If feasible, explore image-based search as an advanced enhancement.

- Text-based search is the minimum requirement.



---



### 2.4 Payment Integration



- Real payment processing is NOT required.

- However, we must integrate at least one Stripe API.

- The goal is to demonstrate page redirection and API interaction rather than successful payment confirmation.



---



## 3. Next Meeting



**Date:** March 9  

**Time:** 3:00 PM  



By that meeting, we are expected to have:



- A basic frontend structure

- A well-designed homepage

- Completed research on:

&nbsp; - Google sign-in integration

&nbsp; - Database/data sourcing options

&nbsp; - Stripe API integration

- Clear implementation strategy for each component



Non-core features can be refined after this milestone.



---



## 4. Action Items



- Research Google authentication API

- Research Stripe API usage and redirect flow

- Identify possible product databases or public APIs

- Begin frontend layout and homepage design

- Define admin vs user page structure



---



## 5. Key Takeaway



The project is expected to demonstrate proper API integration, role-based authentication, search functionality, and controlled payment simulation, while maintaining a clean and well-structured homepage.



