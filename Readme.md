# RajMart 🛒

A modern, full-stack e-commerce platform built with React, Node.js, and MongoDB. Features secure authentication, dynamic product management, integrated payments, and a comprehensive admin dashboard.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://e-commerce-99j2.onrender.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📋 Table of Contents

- [Features](#-features)
- [Demo & Screenshots](#-demo--screenshots)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [Author](#-author)

---

## ✨ Features

### 👥 User Features
- **Authentication**: Secure signup and login with JWT tokens
- **Product Browsing**: Intuitive catalog with search and filters
- **Shopping Cart**: Add, update, and remove items seamlessly
- **Secure Checkout**: Stripe-integrated payment processing
- **Order History**: Track past purchases and order status

### 🔧 Admin Features
- **Product Management**: Create, update, and delete products
- **User Management**: View and manage registered users
- **Order Management**: Monitor and update order statuses
- **Analytics Dashboard**: Revenue insights and sales trends with interactive charts
- **Role-Based Access**: Secure admin-only routes and features

### 🎨 Additional Highlights
- Fully responsive design (mobile-first approach)
- Role-based access control (RBAC)
- Redis caching for optimized performance
- Environment-based logging (production-safe)
- Image uploads via Cloudinary integration

---

## 🎬 Demo & Screenshots

**🌐 Live Application**: [https://e-commerce-99j2.onrender.com/](https://e-commerce-99j2.onrender.com/)

<details>
<summary>📸 Click to view screenshots</summary>

### Home Page
![Home Page](screenshots/home.png)

### Authentication
| Login | Signup |
|-------|--------|
| ![Login](screenshots/login.png) | ![Signup](screenshots/signup.png) |

### Shopping Experience
| Cart | Checkout |
|------|----------|
| ![Cart](screenshots/cart.png) | ![Payment](screenshots/payment.png) |

### Payment Flow
| Success | Cancelled |
|---------|-----------|
| ![Success](screenshots/paymentsuccess.png) | ![Cancel](screenshots/paymentcancel.png) |

### Admin Panel
| Dashboard | Analytics |
|-----------|-----------|
| ![Admin Dashboard](screenshots/admindashboard.png) | ![Analytics](screenshots/analytics.png) |

</details>

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis (Upstash)
- **Authentication**: JWT (access + refresh tokens)
- **Payments**: Stripe API
- **Coupons**: Coupons After purchasing a certain amount and using is stripe payment
- **File Storage**: Cloudinary

### DevOps & Tools
- **Version Control**: Git & GitHub
- **API Testing**: Postman
- **Deployment**: Render
- **Package Manager**: pnpm

---

## 📂 Project Structure

```
ecommerce/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ManyOtherComponents.jsx
│   │   ├── pages/              # Route pages
│   │   │   ├── AdminPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CategoryPage.jsx
│   │   │   └── Homepage.jsx
│   │   │   └── PurchaseSuccessPage.jsx
│   │   │   └── PurchaseCancelPage.jsx
│   │   ├── stores/             # Zustand state stores
│   │   │   ├── useUserStore.js
│   │   │   └── useCartStore.js
│   │   │   └── useProductStore.js
│   │   ├── lib/                # Utility functions & API
│   │   │   └── axios.js
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Application entry point
│   │   └── index.css           # Global styles
│   ├── public/                 # Static assets
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Express API server
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   │   ├── analytics.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── cart.controller.js
│   │   │   ├── coupon.controller.js
│   │   │   └── payment.controller.js
│   │   │   └── product.controller.js
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── user.model.js
│   │   │   ├── product.model.js
│   │   │   ├── coupon.model.js
│   │   │   └── order.model.js
│   │   ├── routes/             # API routes
│   │   │   ├── auth.route.js
│   │   │   ├── product.route.js
│   │   │   ├── cart.route.js
│   │   │   └── payment.route.js
│   │   │   └── analytics.route.js
│   │   │   └── coupon.route.js
│   │   ├── middleware/         # Express middleware
│   │   │   ├── auth.middleware.js
│   │   ├── lib/                # Configuration modules
│   │   │   ├── db.js
│   │   │   ├── redis.js
│   │   │   ├── cloudinary.js
│   │   │   └── stripe.js
│   │   ├── index.js            # Server entry point
│   │   └── .env                # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── package.json                 # Root package.json (monorepo)
├── README.md
└── LICENSE
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** >= 20.x
- **pnpm** >= 10.x (or npm/yarn)
- **MongoDB** (local or Atlas cluster)
- **Redis** instance (Upstash recommended)
- **Stripe** account for payments
- **Cloudinary** account for image uploads

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Prethu-Raj-Debnath/e-commerce.git
cd e-commerce
```

2. **Install dependencies**

```bash
# Install all dependencies (frontend + backend)
pnpm install -C frontend
pnpm install -C backend
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rajmart

# Redis Cache
UPSTASH_REDIS_URL=redis://default:password@redis-url.upstash.io:port

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

> **Security Note**: Never commit your `.env` file. Add it to `.gitignore`.

### Running Locally

#### Development Mode (Separate Ports)

**Terminal 1 - Backend:**
```bash
cd backend
pnpm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm run dev
```
Frontend runs on `http://localhost:5173`

#### Production Mode (Single Port)

Build and serve from backend:

```bash
# Build frontend
pnpm -C frontend build

# Build backend
pnpm -C backend build

# Start production server
pnpm -C backend start
```

Access the application at `http://localhost:5000`

## 📡 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-app.onrender.com/api
```

---

## 🔐 Authentication

This API uses **JWT cookie-based authentication**. Cookies are automatically sent with requests when using `axios` with `withCredentials: true`.

### Setup

```javascript
// src/lib/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true, // Important for cookies
});

export default axiosInstance;
```

### Auth Endpoints

#### **POST** `/auth/signup`
```javascript
await axios.post('/auth/signup', { name, email, password });
```

#### **POST** `/auth/login`
```javascript
await axios.post('/auth/login', { email, password });
```

#### **POST** `/auth/logout`
```javascript
await axios.post('/auth/logout');
```

#### **GET** `/auth/profile`
```javascript
await axios.get('/auth/profile');
```

#### **POST** `/auth/refresh-token`
```javascript
await axios.post('/auth/refresh-token');
```

---

## 🛍️ Products

#### **GET** `/products`
Get all products with optional filters
```javascript
await axios.get('/products?category=electronics&featured=true');
```

#### **GET** `/products/featured`
Get featured products

#### **GET** `/products/category/:category`
Get products by category

#### **GET** `/products/recommendations`
Get recommended products

#### **GET** `/products/:id`
Get single product details

---

## 🛒 Cart

All cart endpoints require authentication.

#### **GET** `/cart`
Get user's cart

#### **POST** `/cart`
Add product to cart
```javascript
await axios.post('/cart', { productId, quantity });
```

#### **DELETE** `/cart/products/:id`
Remove product from cart

#### **PUT** `/cart/:id`
Update product quantity

---

## 💳 Payments

#### **POST** `/payments/create-checkout-session`
Create Stripe checkout session

#### **POST** `/payments/checkout-success`
Handle successful payment
```javascript
await axios.post('/payments/checkout-success', { sessionId });
```

---

## 📊 Analytics (Admin Only)

#### **GET** `/analytics`
Get sales analytics and statistics

---

## 🔧 Admin - Products

#### **POST** `/products` (Admin)
Create new product
```javascript
await axios.post('/products', formData);
```

#### **PATCH** `/products/:id` (Admin)
Update product

#### **DELETE** `/products/:id` (Admin)
Delete product

#### **PATCH** `/products/:id/toggle` (Admin)
Toggle featured status

---

## 🚢 Deployment

### Deploy to Render

1. **Prepare Build Scripts** (already configured in `package.json`):
```json
{
  "scripts": {
    "build": "pnpm -C frontend build && pnpm -C backend build",
    "start": "pnpm -C backend start"
  }
}
```

2. **Push to GitHub**:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

3. **Connect to Render**:
   - Create new Web Service
   - Connect GitHub repository
   - Build command: `pnpm install && pnpm run build`
   - Start command: `pnpm start`

4. **Add Environment Variables** in Render dashboard (same as `.env` file)

5. **Deploy** 🎉

---

## 🔮 Future Enhancements

- [ ] **Wishlist**: Save products for later
- [ ] **Product Reviews**: User ratings and comments
- [ ] **Stock Management**: Real-time inventory tracking
- [ ] **Advanced Search**: Filters by price range, ratings, etc.
- [ ] **Recommendations**: AI-powered product suggestions
- [ ] **Email Notifications**: Order confirmations and updates
- [ ] **Multi-language Support**: Internationalization (i18n)
- [ ] **Dark Mode**: Theme toggle
- [ ] **Order Tracking**: Real-time delivery status

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Prethu Raj Debnath**

- GitHub: [@Prethu-Raj-Debnath](https://github.com/Prethu-Raj-Debnath)
- Project Link: [https://github.com/Prethu-Raj-Debnath/e-commerce](https://github.com/Prethu-Raj-Debnath/e-commerce)

---

## 🙏 Acknowledgments

- [React Documentation](https://react.dev/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Stripe API](https://stripe.com/docs/api)
- [Tailwind CSS](https://tailwindcss.com/)

---

<div align="center">

**If you found this project helpful, please consider giving it a ⭐!**

Made with ❤️ by Prethu Raj Debnath

</div>
