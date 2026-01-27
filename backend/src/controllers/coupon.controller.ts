import { Request, Response } from "express";
import Coupon, { CouponDocument } from "../models/coupon.model.js";
import { IUser } from "../models/user.model.js";

interface AuthRequest extends Request {
  user: IUser;
}

export const getCoupon = async (
	req: AuthRequest,
	res: Response
): Promise<void> => {
	try {
		const coupon: CouponDocument | null = await Coupon.findOne({
			userId: req.user._id,
			isActive: true,
		});

		res.json(coupon ?? null);
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error in getCoupon controller:", error.message);
			res.status(500).json({
				message: "Server error",
				error: error.message,
			});
		}
	}
};

export const validateCoupon = async (
	req: AuthRequest,
	res: Response
): Promise<void> => {
	try {
		const { code }: { code: string } = req.body;

		const coupon: CouponDocument | null = await Coupon.findOne({
			code,
			userId: req.user._id,
			isActive: true,
		});

		if (!coupon) {
			res.status(404).json({ message: "Coupon not found" });
			return;
		}

		// Expiration check
		if (coupon.expirationDate < new Date()) {
			coupon.isActive = false;
			await coupon.save();

			res.status(404).json({ message: "Coupon expired" });
			return;
		}

		res.json({
			message: "Coupon is valid",
			code: coupon.code,
			discountPercentage: coupon.discountPercentage,
		});
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error in validateCoupon controller:", error.message);
			res.status(500).json({
				message: "Server error",
				error: error.message,
			});
		}
	}
};
