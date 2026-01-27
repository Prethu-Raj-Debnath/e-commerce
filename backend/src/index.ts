import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);
console.log(__filename);

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app: express.Application = express();
const PORT: number = Number(process.env.PORT) || 3001;

// const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

const frontendDistPath = path.resolve(
  __dirname,
  "..",
  "..",
  "frontend",
  "dist"
);
console.log(frontendDistPath)

if (process.env.NODE_ENV === "production") {
  console.log("here is ✌");
  app.use(express.static(frontendDistPath));

  // Change '*' to '{*path}' or ':any*'
  app.get("{*path}", (_req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}


async function start(): Promise<void> {
    await connectDB();
    app.listen(PORT, () => {
        console.log("Server is running on port:" + PORT);
    });
}

start().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});