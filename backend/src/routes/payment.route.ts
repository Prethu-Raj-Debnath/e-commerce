import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkoutSuccess, createCheckoutSession } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession as unknown as express.RequestHandler);
router.post("/checkout-success", protectRoute, checkoutSuccess);

export default router;
