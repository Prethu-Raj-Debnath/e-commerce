# RajMart 🛒

A full-stack e-commerce web application built with **React**, **Node.js**, and **MongoDB**, featuring user authentication, product management, and secure payments.  
Modern, responsive, and ready for production deployment.

---

## 🚀 Demo
**Live Demo:** [https://e-commerce-99j2.onrender.com/]  

## 📸 Screenshots

### 🏠 Home Page
![Home Page](screenshots/home.png)

---

### 🔐 Login & Register
![Login](screenshots/login.png)
![Signup](screenshots/signup.png)

---

### 📊 Dashboard
![Dashboard](screenshots/analytics.png)

---

### 🛒 Cart & Checkout
![Cart](screenshots/cart.png)
![Payment](screenshots/payment.png)
![Payment Success](screenshots/paymentsuccess.png)
![Payment Cancel](screenshots/paymentcancel.png)

---

### 🛠 Admin Panel
![Admin Dashboard](screenshots/admindashboard.png)

---

## ✨ Features

### User
- User signup & login (JWT)
- Browse products
- Add/remove items from cart
- Secure checkout with payment integration

### Admin
- Add/update/delete products
- Manage users
- View & update orders
- View Revenue and sales analytics

### Other
- Responsive UI (mobile and desktop)
- Role-based access control
- Environment-based logging (no console logs in production)

---

## 🛠 Tech Stack

**Frontend**
- React
- Tailwind CSS
- Axios
- Zustand (for state management)
- Recharts for analytics dashboard

**Backend**
- Node.js
- Express.js
- Typescript
- MongoDB (Mongoose)
- Redis for cacheing
- JWT Authentication
- Payment integration (Stripe)

**Development Tools**
- Vite / CRA
- Postman for API testing

---

## 📂 Project Structure

```text
ecommerce/
├── frontend/                      # React Frontend
│   ├── src/
│   │   ├── components/         # Navbar, PrivateRoute
│   │   ├── pages/              # Login, Dashboard, Payments
│   │   ├── stores/             # Auth context
│   │   ├── lib/                # API service (Axios)
│   │   ├── App.jsx             # Main app with routing
│   │   ├── index.css              
│   │   └── main.jsx            # Entry point
│   └── index.html
│   └── package.json
├── backend/                     # Express Backend
│   ├── src/
│   │   ├── controllers/             # controller functions for route
│   │   ├── lib/                     # setup files for database,redis,cloudinary,stripe payment
│   │   ├── middleware/              # middleware to protect routes
│   │   ├── routes/                  # MongoDB models
│   │   ├── routes/                  # API routes
│   │   └── index.js                 # Entry point
│   │   └── .env                     # environment variables for backend
│   └── package.json
└── package.json                     # Root package.json /monorepo structure
🔐 Environment Variables
Create a .env file in server/ folder:

NODE_ENV="production"
PORT=5000
MONGO_URI=
UPSTASH_REDIS_URL=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_URL=
STRIPE_SECRET_KEY=
CLIENT_URL=

⚙️ Installation & Running Locally
1. Clone the repo
git clone https://github.com/Prethu-Raj-Debnath/e-commerce.git
pnpm install -C frontend && pnpm install -C backend && pnpm -C frontend build && pnpm -C backend build
pnpm -C backend start
http://localhost:5000 (backend ,frontend works via backend ,you can setup each separately if you want).

🔌 API Endpoints (stable for this project)

Auth
- POST /api/auth/register  
  - Description: Register a new user.  
  - Body: { "name": string, "email": string, "password": string }  
  - Response: 201 { _id, name, email, role }  
  - Notes: Sets httpOnly cookies: accessToken, refreshToken.

- POST /api/auth/login  
  - Description: User login.  
  - Body: { "email": string, "password": string }  
  - Response: 200 { _id, name, email, role }  
  - Notes: Sets httpOnly cookies. Client must send requests with credentials (fetch: credentials: "include", axios: withCredentials: true).

- POST /api/auth/refresh  
  - Description: Refresh access token using refresh cookie.  
  - Auth: requires refreshToken cookie.  
  - Response: 200 (sets new accessToken cookie)

- POST /api/auth/logout  
  - Description: Clear auth cookies and invalidate refresh token server-side.  
  - Response: 200 { message }

- GET /api/auth/profile  
  - Description: Get current user profile.  
  - Auth: requires valid access token (cookie or Authorization header).  
  - Response: 200 { _id, name, email, role, ... }

Products
- GET /api/products  
  - Description: List products (supports query filters / pagination).  
  - Response: 200 [ products ]

- GET /api/products/:id  
  - Description: Product details.  
  - Response: 200 product

Cart & Orders
- GET /api/cart  
  - Description: Get current user cart. Auth required.  
  - Response: 200 cart

- POST /api/cart  
  - Description: Add / update cart item. Auth required.  
  - Body: { productId: string, quantity: number }  
  - Response: 200 cart

Payments
- POST /api/payment  
  - Description: Create payment intent / start checkout (Stripe). Auth required.  
  - Body: { cartId: string, paymentMethod?: string }  
  - Response: 200 { clientSecret, paymentIntentId }

- POST /api/webhook/payment  
  - Description: Stripe webhook endpoint to confirm payment and update order status.  
  - Notes: Use raw body verification with Stripe signature.

Admin (examples)
- POST /api/products (admin) — create product  
- PUT /api/products/:id (admin) — update product  
- DELETE /api/products/:id (admin) — delete product  
- GET /api/dashboard (admin) — sales / analytics

Important implementation notes
- Cookies: server sets httpOnly cookies. For cross-origin local development set sameSite: "lax" (or "none" + secure:true on HTTPS) and enable CORS with credentials on the server. Example server CORS: cors({ origin: CLIENT_URL, credentials: true }). Client must use credentials to receive/send cookies.
- Auth: endpoints accept accessToken via httpOnly cookie or Authorization: Bearer <token>.
- Error handling: endpoints respond with appropriate 4xx/5xx and JSON { message, ... }.


🚧 Future Improvements
Wishlist & product reviews
Payment webhook handling
Product Stock feature and logic
Advance search filter and recommendation

Advanced analytics in admin dashboard



👤 Author
Prethu Raj Debnath
GitHub: https://github.com/Prethu-Raj-Debnath/