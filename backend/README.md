# E-Commerce Backend

Node.js + Express backend for the e-commerce platform using MongoDB.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file with:

```
MONGODB_URI=mongodb+srv://every_db:every-pass@cluster0.mw7fggq.mongodb.net/ecommerce?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

### 3. Start Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/update` - Update user profile (protected)

### Products
- `GET /api/products` - Get all products (with search, filter, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

### Cart
- `GET /api/cart` - Get user cart (protected)
- `POST /api/cart/add` - Add item to cart (protected)
- `PUT /api/cart/update/:productId` - Update cart item quantity (protected)
- `DELETE /api/cart/remove/:productId` - Remove item from cart (protected)
- `DELETE /api/cart/clear` - Clear entire cart (protected)

### Orders
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:id` - Get single order (protected)
- `POST /api/orders/create` - Create new order (protected)
- `PUT /api/orders/:id/status` - Update order status (protected)
- `DELETE /api/orders/:id` - Cancel order (protected)

## Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Database Schema

### Users
- name, email, password (hashed), phone
- address (street, city, state, postalCode, country)
- createdAt

### Products
- name, description, price, image, brand
- category (T-Shirts, Electronics, Accessories, Footwear, Other)
- stock, rating, reviews
- createdAt, updatedAt

### Cart
- user (reference to User)
- items (array of product + quantity + price)
- totalPrice
- createdAt, updatedAt

### Orders
- user (reference to User)
- items (array of products with quantity and price)
- shippingAddress (street, city, state, postalCode, country)
- orderStatus (pending, processing, shipped, delivered, cancelled)
- paymentStatus (pending, completed, failed)
- paymentMethod (credit_card, debit_card, net_banking, upi, cash_on_delivery)
- totalAmount, shippingCost, tax, subtotal
- createdAt, updatedAt
