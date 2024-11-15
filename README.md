# E-Commerce API with Authentication, Product, Cart, Orders, and MPESA Payment Integration

This is an e-commerce API built with **NestJS**, **TypeORM**, and **MySQL** that provides backend functionality for an online store. It includes essential features such as user authentication and authorization, product management, cart handling, order processing, and MPESA payment integration.

## Features

### 1. **Authentication and Authorization**
- User registration and login with JWT-based authentication.
- Role-based access control (admin, customer).

### 2. **User Management**
- CRUD operations for user profiles (view, update, delete).
- Secure password hashing and storage.

### 3. **Product Management**
- Admin functionality to add, update, and delete products.
- Support for product categories and tags.
- Customer-facing product listing and details retrieval.

### 4. **Cart Management**
- Users can add, update, and remove products in their cart.
- Cart is linked to the authenticated user.

### 5. **Order Management**
- Users can create orders and track their status.
- Admins can view and manage all customer orders.

### 6. **MPESA Payment Integration**
- Integration with MPESA for processing payments.
- Supports order payments and payment status tracking.

## Technologies

- **NestJS**: A Node.js framework for building efficient, reliable, and scalable server-side applications.
- **TypeORM**: A TypeScript ORM for interacting with MySQL databases.
- **MySQL**: Relational database to store user, product, cart, order, and payment data.
- **JWT**: For handling user authentication and authorization securely.

