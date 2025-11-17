# Backend Setup Guide

## Prerequisites

1. **Node.js & npm** - Download from https://nodejs.org/
   - Choose the LTS version
   - Verify installation: `node --version` and `npm --version`

2. **MongoDB Atlas Account** - Already set up with your connection string

## Installation & Setup

### Step 1: Navigate to Backend Folder

```cmd
cd E-commerce-main\backend
```

### Step 2: Install Dependencies

```cmd
npm install
```

This will install all required packages:
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **cors** - Cross-origin requests
- **express-validator** - Input validation
- **nodemon** - Auto-reload in development

### Step 3: Start the Server

**Development Mode (with auto-reload):**
```cmd
npm run dev
```

**Production Mode:**
```cmd
npm start
```

Server will start on: `http://localhost:5000`

You should see:
```
MongoDB Connected
Server is running on port 5000
```

## Backend Structure

```
backend/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env                   # Environment variables (MongoDB URI, JWT Secret)
├── README.md              # API documentation
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── models/
│   ├── User.js           # User schema
│   ├── Product.js        # Product schema
│   ├── Cart.js           # Cart schema
│   └── Order.js          # Order schema
└── routes/
    ├── auth.js           # Authentication endpoints
    ├── products.js       # Product endpoints
    ├── cart.js           # Cart endpoints
    └── orders.js         # Order endpoints
```

## Testing the Backend

### Health Check
```
GET http://localhost:5000/health
```

### Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Save the returned `token` for authenticated requests.

### Get Products
```
GET http://localhost:5000/api/products?limit=10&page=1
```

### Get Products with Search
```
GET http://localhost:5000/api/products?search=shirt&category=T-Shirts
```

### Add Product (Authenticated)
```
POST http://localhost:5000/api/products
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "Cartoon Astronauts T-Shirt",
  "description": "Comfortable cotton t-shirt",
  "price": 400,
  "image": "img/product/f1.jpg",
  "brand": "adidas",
  "category": "T-Shirts",
  "stock": 50
}
```

### Add to Cart (Authenticated)
```
POST http://localhost:5000/api/cart/add
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "productId": "product-id-here",
  "quantity": 1
}
```

### Get Cart (Authenticated)
```
GET http://localhost:5000/api/cart
Authorization: Bearer <your-token>
```

### Create Order (Authenticated)
```
POST http://localhost:5000/api/orders/create
Authorization: Bearer <your-token>
Content-Type: application/json

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

## Connecting Frontend to Backend

Update your frontend JavaScript to make API calls:

```javascript
// Example: Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
localStorage.setItem('token', data.token);

// Example: Get Products
const response = await fetch('http://localhost:5000/api/products');
const data = await response.json();
```

## Troubleshooting

### MongoDB Connection Error
- Verify MongoDB URI in `.env` file
- Ensure your IP is whitelisted in MongoDB Atlas
- Check MongoDB username and password

### Port Already in Use
Change PORT in `.env` file to another port like `5001`

### CORS Errors
- Backend has CORS enabled by default
- If issues persist, ensure `cors` package is installed

### npm install fails
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again
- Try `npm cache clean --force` if needed

## Production Deployment

1. Change `JWT_SECRET` in `.env` to a strong random key
2. Set `NODE_ENV=production`
3. Use a production database URI
4. Consider using PM2 or Docker for deployment

```cmd
npm install -g pm2
pm2 start server.js --name "ecommerce-api"
pm2 save
```

## Next Steps

1. Add product seed data to MongoDB
2. Integrate frontend with backend APIs
3. Implement payment gateway (Stripe/PayPal)
4. Add email notifications
5. Set up admin dashboard
