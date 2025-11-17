# E-Commerce Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (HTML/CSS/JS)                   │
│  (index.html, shop.html, cart.html, signin.html, etc.)          │
└─────────────────────────────────────────────────────────────────┘
                                 ↓ (HTTP/REST)
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS API SERVER (Port 5000)            │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Authentication Middleware (JWT)             │    │
│  │  - Token validation                                      │    │
│  │  - User authorization                                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Route Handlers (Controllers)                │    │
│  │  - /auth (register, login, profile)                     │    │
│  │  - /products (CRUD operations)                          │    │
│  │  - /cart (add, update, remove items)                    │    │
│  │  - /orders (create, view, cancel)                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Data Models (Mongoose)                      │    │
│  │  - User: Authentication & Profile                       │    │
│  │  - Product: Catalog                                     │    │
│  │  - Cart: User Shopping Cart                             │    │
│  │  - Order: Purchase History                              │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                 ↓ (Mongoose Driver)
┌─────────────────────────────────────────────────────────────────┐
│                    MONGODB ATLAS (Cloud Database)               │
│                                                                   │
│  Database: ecommerce                                            │
│  Collections:                                                    │
│  - users (1000+ documents)                                      │
│  - products (100+ documents)                                    │
│  - carts (100+ documents)                                       │
│  - orders (1000+ documents)                                     │
│  - reviews (500+ documents)                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling & Responsive Design
- **JavaScript (Vanilla)** - Client-side logic
- **Bootstrap 5** - UI Framework (CDN)
- **Font Awesome** - Icons (CDN)

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **Mongoose** - MongoDB ODM (Object Data Mapper)
- **JWT** - Authentication
- **bcryptjs** - Password Hashing

### Database
- **MongoDB Atlas** - Cloud Database
- **Connection URI**: `mongodb+srv://every_db:every-pass@cluster0.mw7fggq.mongodb.net/ecommerce`

## Data Flow

### User Registration Flow
```
User enters credentials in signup.html
          ↓
Frontend validates input
          ↓
POST /api/auth/register (JSON)
          ↓
Backend validates & hashes password
          ↓
Create User document in MongoDB
          ↓
Generate JWT token
          ↓
Return token + user data
          ↓
Frontend stores token in localStorage
          ↓
Redirect to dashboard
```

### Product Purchase Flow
```
User browses products (GET /api/products)
          ↓
Select product & add to cart (POST /api/cart/add)
          ↓
Cart item stored in MongoDB (Cart collection)
          ↓
User views cart & updates quantities
          ↓
User provides shipping address
          ↓
POST /api/orders/create
          ↓
Create Order document with:
- User ID
- Cart items
- Shipping address
- Payment info
- Pricing (subtotal, tax, shipping)
          ↓
Clear user's cart
          ↓
Return order confirmation
          ↓
Frontend shows order details
```

### Authentication Flow
```
1. User logs in → POST /api/auth/login
2. Backend validates credentials → Compares password hash
3. Success → Generates JWT token with expiry (7 days)
4. Frontend stores token → localStorage
5. Subsequent requests include token in Authorization header
6. Backend validates token → Allows access to protected routes
7. Token expires → User must login again
```

## API Endpoints Summary

### Authentication (Public)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user (Protected) |
| PUT | `/api/auth/update` | Update profile (Protected) |

### Products (Public Read, Protected Write)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/products` | Get all products (paginated) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (Protected) |
| PUT | `/api/products/:id` | Update product (Protected) |
| DELETE | `/api/products/:id` | Delete product (Protected) |

### Cart (Protected)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/update/:productId` | Update item quantity |
| DELETE | `/api/cart/remove/:productId` | Remove item from cart |
| DELETE | `/api/cart/clear` | Clear entire cart |

### Orders (Protected)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/orders` | Get user's orders |
| GET | `/api/orders/:id` | Get order details |
| POST | `/api/orders/create` | Create new order |
| PUT | `/api/orders/:id/status` | Update order status |
| DELETE | `/api/orders/:id` | Cancel order (if pending) |

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  image: String (URL/path),
  brand: String,
  category: String (enum),
  stock: Number,
  rating: Number (1-5),
  reviews: [{
    user: ObjectId (ref: User),
    comment: String,
    rating: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Carts Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  totalPrice: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    productName: String,
    quantity: Number,
    price: Number
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  orderStatus: String (enum: pending, processing, shipped, delivered, cancelled),
  paymentStatus: String (enum: pending, completed, failed),
  paymentMethod: String (enum: credit_card, debit_card, net_banking, upi, cod),
  subtotal: Number,
  tax: Number,
  shippingCost: Number,
  totalAmount: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

### 1. Password Security
- Passwords hashed using bcryptjs
- Salt rounds: 10
- Never stored in plain text
- Never sent in API responses

### 2. Authentication
- JWT (JSON Web Tokens) for stateless authentication
- Token expiry: 7 days
- Token includes user ID and created timestamp
- Tokens validated on every protected route

### 3. Data Validation
- Input validation on all endpoints
- Email format validation
- Required field checks
- Type validation

### 4. CORS
- Enabled for all origins (configurable)
- Prevents unauthorized cross-domain requests

### 5. Environment Variables
- Sensitive data stored in .env
- MongoDB URI not exposed in code
- JWT secret not exposed in code

## Performance Considerations

### Database Indexing
- Email field indexed for fast lookups
- User ID indexed for cart/order queries
- Category field indexed for product filters

### Pagination
- Default limit: 10 items per page
- Max limit: 100 items per page
- Reduces memory usage for large result sets

### Query Optimization
- Populate only necessary fields
- Use projections to limit returned data
- Implement caching for frequently accessed data

## Scalability

### Horizontal Scaling
- Stateless architecture (can run multiple instances)
- Load balancer distributes requests
- MongoDB Atlas handles database scaling

### Future Improvements
- Implement Redis caching for sessions
- Add request rate limiting
- Implement database connection pooling
- Add API versioning (/api/v1/, /api/v2/)

## Deployment Architecture

### Development
```
Local Machine
├── Frontend (port 5500 - Live Server)
└── Backend (port 5000 - Node.js)
    └── MongoDB Atlas (Cloud)
```

### Production
```
Web Server (Nginx/Apache)
├── Frontend (Static files)
└── API Gateway
    ├── Node.js Server 1
    ├── Node.js Server 2
    └── Node.js Server N
    
All servers connect to:
└── MongoDB Atlas (Cloud)
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes
- 200: OK
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (no/invalid token)
- 403: Forbidden (no permission)
- 404: Not Found
- 500: Server Error

## Future Enhancements

1. **Payment Integration**
   - Stripe API for credit card payments
   - PayPal integration
   - UPI payment gateway

2. **Email Notifications**
   - Order confirmation emails
   - Shipping updates
   - Password reset emails

3. **Admin Dashboard**
   - Product management UI
   - Order management
   - User management
   - Analytics

4. **Advanced Features**
   - Wishlist/Favorites
   - Product reviews & ratings
   - Search with Elasticsearch
   - Recommendation engine
   - Discount codes/Coupons

5. **DevOps**
   - Docker containerization
   - CI/CD pipeline
   - Automated testing
   - Monitoring & logging

## Testing Strategy

### Unit Tests
- Test individual functions
- Test data validation
- Test authentication logic

### Integration Tests
- Test API endpoints
- Test database operations
- Test complete user flows

### Load Testing
- Test with 1000+ concurrent users
- Test database performance
- Identify bottlenecks

---

This architecture provides a solid foundation for a scalable, secure e-commerce platform.
