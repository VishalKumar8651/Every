# MySQL Database Setup Guide

## Prerequisites
- MySQL Server installed on your system
- MySQL Workbench or command-line access

## Steps to Set Up Database

### 1. Start MySQL Server
Make sure your MySQL server is running.

### 2. Create Database and Tables
Open MySQL Workbench or command line and run:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    stock INT NOT NULL DEFAULT 0
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 3. Update Database Connection
Edit `src/main/java/com/ecommerce/DatabaseConnection.java`:
- Update `USER` to your MySQL username (default: "root")
- Update `PASSWORD` to your MySQL password

### 4. View Registered Users

#### Using MySQL Workbench:
```sql
SELECT * FROM users;
```

#### Using Command Line:
```bash
mysql -u root -p
USE ecommerce_db;
SELECT * FROM users;
```

#### View specific user details:
```sql
-- View all users with their registration date
SELECT id, username, email, created_at FROM users ORDER BY created_at DESC;

-- Count total users
SELECT COUNT(*) as total_users FROM users;

-- Search for specific user
SELECT * FROM users WHERE username = 'john_doe';
SELECT * FROM users WHERE email LIKE '%@example.com';
```

## Security Note
⚠️ **Important:** Passwords should be hashed before storing in the database. Never store plain text passwords in production!
