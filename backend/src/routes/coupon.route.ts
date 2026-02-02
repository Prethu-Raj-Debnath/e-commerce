import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCoupon as unknown as express.RequestHandler);
router.post("/validate", protectRoute, validateCoupon as unknown as express.RequestHandler);

export default router;
