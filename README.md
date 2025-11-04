# Node.js Backend Project Template

## Overview

This repository serves as a template for building scalable and maintainable backend applications using Node.js, Express, and PostgreSQL. It is designed as a solid foundation for RESTful API projects requiring secure authentication, role-based access control, and structured database interactions.

## Description

This template provides a modular and extensible backend architecture, including features such as authentication, input validation, error handling, and efficient database management. It encourages best practices like environment-based configuration, parameterized queries or ORMs for database security, and automatic server restarts with nodemon during development.

## Features

- **Node.js & Express:** Fast, lightweight backend framework.
- **PostgreSQL Integration:** Robust relational database support.
- **Authentication & Authorization:** JWT-based secure access control.
- **Modular Architecture:** Organised by controllers, services, models, routes, and middleware.
- **Input Validation:** Ensures data integrity using validation libraries.
- **Centralised Error Handling:** Clean and consistent API error responses.
- **Nodemon:** Watch file changes and restart the server automatically in development.
- **Environment Configuration:** Manage sensitive configuration via `.env` files.

## Getting Started

### Prerequisites

Ensure the following are installed on your system:

- Node.js (version 22 or higher)
- PostgreSQL (latest stable release)
- npm or Yarn

### Installation

1. Clone this template repository:
   ```
   git clone <repository-url>
   cd <project-directory>
   ```
2. Install dependencies:
   ```
   yarn install
   ```
3. Configure environment variables by creating a `.env` file at the root.
4. Run database migration scripts to set up the schema.
5. Start the development server with live reload:
   ```
   yarn dev
   ```

## Project Structure

```
project-root/
│
├── src/
│   ├── config/             # Environment and DB configs
│   ├── controllers/        # Request handlers
│   ├── services/           # Business and DB logic
│   ├── models/             # Database schema definitions
│   ├── routes/             # API endpoint declarations
│   ├── middlewares/        # Custom middleware (auth, validation, error handlers)
│   ├── utils/              # Utility/helper functions
│   ├── server.js           # Express app startup
│
├── migrations/             # DB migration scripts
├── .env                    # Environment variables
├── package.json            # Project metadata and dependencies
└── README.md               # Project documentation
```

## Scripts

- `yarn dev` — Start server with nodemon for hot reload.
- `yarn start` — Run server in production mode.
- `yarn test` — Run tests.

## Database Schema

The application uses a PostgreSQL database, managed with Prisma. Below is an overview of the data models and their relationships.

### Models

#### `User`
- **Table Name:** `users`
- **Description:** Stores user information, including authentication details.
- **Fields:**
    - `id`: Unique identifier (UUID).
    - `email`: User's email address (unique).
    - `password`: Hashed password.
    - `createdAt`: Timestamp for creation.
    - `updatedAt`: Timestamp for last update.
- **Relationships:**
    - `teams`: Many-to-many relationship with `Team` through `TeamMember`.
    - `expenses`: One-to-many relationship with `Expense` (as creator).
    - `expenseSplits`: One-to-many relationship with `ExpenseSplit`.

#### `Team`
- **Table Name:** `teams`
- **Description:** Stores information about teams.
- **Fields:**
    - `id`: Unique identifier (UUID).
    - `name`: Team name.
    - `description`: Optional team description.
    - `createdAt`: Timestamp for creation.
    - `updatedAt`: Timestamp for last update.
- **Relationships:**
    - `members`: Many-to-many relationship with `User` through `TeamMember`.
    - `expenses`: One-to-many relationship with `Expense`.

#### `TeamMember`
- **Table Name:** `team_members`
- **Description:** Junction table for many-to-many relationship between `User` and `Team`.
- **Fields:**
    - `userId`: Foreign key to `User` (onDelete: Cascade).
    - `teamId`: Foreign key to `Team` (onDelete: Cascade).
- **Relationships:**
    - `User`: Links to the `User` model.
    - `Team`: Links to the `Team` model.
- **Primary Key:** Composite key `(userId, teamId)`.

#### `Expense`
- **Table Name:** `expenses`
- **Description:** Records individual expenses made by users within a team.
- **Fields:**
    - `id`: Unique identifier (UUID).
    - `teamId`: Foreign key to `Team` (onDelete: Cascade).
    - `createdBy`: Foreign key to `User` (onDelete: Cascade).
    - `expenseCategoryId`: Optional foreign key to `ExpenseCategory` (onDelete: SetNull).
    - `amount`: Amount of the expense (decimal).
    - `createdAt`: Timestamp for creation.
    - `updatedAt`: Timestamp for last update.
- **Relationships:**
    - `Team`: Links to the `Team` model.
    - `Creator`: Links to the `User` model who created the expense.
    - `ExpenseCategory`: Links to the `ExpenseCategory` model.
    - `expenseSplits`: One-to-many relationship with `ExpenseSplit`.

#### `ExpenseCategory`
- **Table Name:** `expense_categories`
- **Description:** Defines categories for expenses (e.g., Food, Travel).
- **Fields:**
    - `id`: Unique identifier (UUID).
    - `name`: Category name.
    - `createdAt`: Timestamp for creation.
    - `updatedAt`: Timestamp for last update.
- **Relationships:**
    - `expenses`: One-to-many relationship with `Expense`.

#### `ExpenseSplit`
- **Table Name:** `expense_splits`
- **Description:** Records how an expense is split among users.
- **Fields:**
    - `userId`: Foreign key to `User` (onDelete: Cascade).
    - `expenseId`: Foreign key to `Expense` (onDelete: Cascade).
    - `amount`: The amount of the expense allocated to this user (decimal).
    - `createdAt`: Timestamp for creation.
    - `updatedAt`: Timestamp for last update.
- **Relationships:**
    - `User`: Links to the `User` model.
    - `Expense`: Links to the `Expense` model.
- **Primary Key:** Composite key `(userId, expenseId)`.

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Introduction](https://jwt.io/introduction/)
- [Nodemon Guide](https://nodemon.io/)

---

This template README file is designed to be adapted to any Node.js backend project following modern development practices.
