# API Documentation

### POST /api/auth/register
##POST /api/auth/login
##POST /api/invoices
##GET /api/invoices
##PUT /api/invoices/:id
##DELETE /api/invoices/:id

# Implementation Explanation

## Libraries Used
1. Express: To create a RESTful API.
2. Mongoose: To interact with MongoDB.
3. Bcrypt: For secure password hashing.
4. JWT (jsonwebtoken): For authentication and role-based access control.
5. Dotenv: To manage environment variables.
6. PDFKit: For generating PDF invoices (optional).

## Key Features
- Role-Based Access Control (RBAC): Admins can perform all operations; regular users have restricted access.
- Invoice Features:
  - Auto-generated or custom invoice numbers.
  - Tax calculations and discounts.
  - Payment tracking (e.g., pending, paid, overdue).
- Authentication: Secure login using hashed passwords and JWT tokens.

## Challenges Faced
- Ensuring proper validation for dynamic fields like items, tax rate, etc.
- Implementing RBAC to handle different permissions for admin and user roles.
- Dynamically generating total amounts, including taxes and discounts.


