# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Authentication

Protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### 2. Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### 3. Get Current User
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA"
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 4. Update User Profile
**PUT** `/auth/update`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "Jane Doe",
  "phone": "9876543210",
  "address": {
    "street": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "postalCode": "90001",
    "country": "USA"
  }
}
```

**Response:**
```json
{
  "success": true,
  "user": { ... }
}
```

---

## Product Endpoints

### 1. Get All Products
**GET** `/products`

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10
- `search` (optional): Search by name or description
- `category` (optional): Filter by category (T-Shirts, Electronics, Accessories, Footwear, Other)

**Examples:**
```
GET /products
GET /products?page=1&limit=10
GET /products?search=shirt
GET /products?category=Electronics
GET /products?search=phone&limit=5&page=1
```

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Cartoon Astronauts T-Shirt",
      "description": "Comfortable cotton t-shirt",
      "price": 400,
      "image": "img/product/f1.jpg",
      "brand": "adidas",
      "category": "T-Shirts",
      "stock": 50,
      "rating": 5,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "pages": 10,
    "currentPage": 1
  }
}
```

---

### 2. Get Single Product
**GET** `/products/:id`

**Response:**
```json
{
  "success": true,
  "product": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Cartoon Astronauts T-Shirt",
    "description": "Comfortable cotton t-shirt with cartoon design",
    "price": 400,
    "image": "img/product/f1.jpg",
    "brand": "adidas",
    "category": "T-Shirts",
    "stock": 50,
    "rating": 5,
    "reviews": [],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 3. Create Product (Protected)
**POST** `/products`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Premium Polo Shirt",
  "description": "Comfortable and stylish polo shirt",
  "price": 599,
  "image": "img/product/polo.jpg",
  "brand": "Nike",
  "category": "T-Shirts",
  "stock": 30
}
```

**Response:**
```json
{
  "success": true,
  "product": { ... }
}
```

---

### 4. Update Product (Protected)
**PUT** `/products/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:** (any field to update)
```json
{
  "price": 549,
  "stock": 25
}
```

---

### 5. Delete Product (Protected)
**DELETE** `/products/:id`

**Headers:**
```
Authorization: Bearer <token>
```

---

## Cart Endpoints (All Protected)

### 1. Get Cart
**GET** `/cart`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "cart": {
    "id": "507f1f77bcf86cd799439011",
    "user": "507f1f77bcf86cd799439012",
    "items": [
      {
        "product": {
          "id": "507f1f77bcf86cd799439013",
          "name": "T-Shirt",
          "price": 400,
          "image": "img/product/f1.jpg"
        },
        "quantity": 2,
        "price": 400
      }
    ],
    "totalPrice": 800,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 2. Add to Cart
**POST** `/cart/add`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "productId": "507f1f77bcf86cd799439013",
  "quantity": 2
}
```

---

### 3. Update Cart Item
**PUT** `/cart/update/:productId`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "quantity": 3
}
```

---

### 4. Remove from Cart
**DELETE** `/cart/remove/:productId`

**Headers:**
```
Authorization: Bearer <token>
```

---

### 5. Clear Cart
**DELETE** `/cart/clear`

**Headers:**
```
Authorization: Bearer <token>
```

---

## Order Endpoints (All Protected)

### 1. Get User Orders
**GET** `/orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "507f1f77bcf86cd799439014",
      "user": "507f1f77bcf86cd799439012",
      "items": [
        {
          "product": "507f1f77bcf86cd799439013",
          "productName": "T-Shirt",
          "quantity": 2,
          "price": 400
        }
      ],
      "shippingAddress": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "USA"
      },
      "orderStatus": "pending",
      "paymentStatus": "pending",
      "paymentMethod": "cash_on_delivery",
      "subtotal": 800,
      "tax": 144,
      "shippingCost": 50,
      "totalAmount": 994,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 2. Get Single Order
**GET** `/orders/:id`

**Headers:**
```
Authorization: Bearer <token>
```

---

### 3. Create Order
**POST** `/orders/create`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card"
}
```

**Response:**
```json
{
  "success": true,
  "order": { ... },
  "message": "Order created successfully"
}
```

---

### 4. Update Order Status
**PUT** `/orders/:id/status`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "orderStatus": "shipped",
  "paymentStatus": "completed"
}
```

**Allowed statuses:**
- `orderStatus`: pending, processing, shipped, delivered, cancelled
- `paymentStatus`: pending, completed, failed

---

### 5. Cancel Order
**DELETE** `/orders/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Note:** Can only cancel orders with `orderStatus: "pending"`

---

## Error Codes

| Code | Message | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request body and parameters |
| 401 | Unauthorized | Token is missing or invalid |
| 403 | Forbidden | You don't have permission |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Contact support |

---

## Rate Limiting

Currently, no rate limiting is implemented. This should be added in production.

---

## Pagination

For endpoints that return lists, use:
- `page`: Default 1 (starts from 1)
- `limit`: Default 10, Maximum 100

Example:
```
GET /products?page=2&limit=20
```

---

## Testing

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'

# Get Products
curl http://localhost:5000/api/products

# Add to Cart (with token)
curl -X POST http://localhost:5000/api/cart/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"PRODUCT_ID","quantity":1}'
```

### Using Postman

1. Create a collection
2. Add requests for each endpoint
3. Use environment variables for base URL and token
4. Test authentication flow first
5. Save responses as examples
