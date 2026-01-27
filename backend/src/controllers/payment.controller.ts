import { Request, Response } from "express";
import Coupon, { CouponDocument } from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";
import { IUser } from "../models/user.model.js";

interface AuthRequest extends Request {
  user: IUser;
}

interface CheckoutProduct {
	_id: string;
	name: string;
	image: string;
	price: number;
	quantity: number;
}


// ---- Controllers ----

export const createCheckoutSession = async (
	req: AuthRequest,
	res: Response
): Promise<void> => {
	try {
		const { products, couponCode }: { products: CheckoutProduct[]; couponCode?: string } =
			req.body;

		if (!Array.isArray(products) || products.length === 0) {
			res.status(400).json({ error: "Invalid or empty products array" });
			return;
		}

		let totalAmount = 0;

		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100); // cents
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: product.name,
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		let coupon: CouponDocument | null = null;

		if (couponCode) {
			coupon = await Coupon.findOne({
				code: couponCode,
				userId: req.user._id,
				isActive: true,
			});

			if (coupon) {
				totalAmount -= Math.round(
					(totalAmount * coupon.discountPercentage) / 100
				);
			}
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			discounts: coupon
				? [
						{
							coupon: await createStripeCoupon(
								coupon.discountPercentage
							),
						},
				  ]
				: [],
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode ?? "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

		if (totalAmount >= 20000) {
			await createNewCoupon(req.user._id.toString());
		}

		res.status(200).json({
			id: session.id,
			totalAmount: totalAmount / 100,
		});
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error processing checkout:", error.message);
			res.status(500).json({
				message: "Error processing checkout",
				error: error.message,
			});
		}
	}
};

export const checkoutSuccess = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { sessionId }: { sessionId: string } = req.body;

		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status !== "paid") {
			res.status(400).json({ message: "Payment not completed" });
			return;
		}

		if (session.metadata?.couponCode) {
			await Coupon.findOneAndUpdate(
				{
					code: session.metadata.couponCode,
					userId: session.metadata.userId,
				},
				{ isActive: false }
			);
		}

		const products: Array<{
			id: string;
			quantity: number;
			price: number;
		}> = JSON.parse(session.metadata?.products || "[]");

		const newOrder = new Order({
			user: session.metadata?.userId,
			products: products.map((p) => ({
				product: p.id,
				quantity: p.quantity,
				price: p.price,
			})),
			totalAmount: (session.amount_total ?? 0) / 100,
			stripeSessionId: sessionId,
		});

		await newOrder.save();

		res.status(200).json({
			success: true,
			message:
				"Payment successful, order created, and coupon deactivated if used.",
			orderId: newOrder._id,
		});
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error processing successful checkout:", error.message);
			res.status(500).json({
				message: "Error processing successful checkout",
				error: error.message,
			});
		}
	}
};

// ---- Helpers ----

async function createStripeCoupon(
	discountPercentage: number
): Promise<string> {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",
	});

	return coupon.id;
}

async function createNewCoupon(
	userId: string
): Promise<CouponDocument> {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(
			Date.now() + 30 * 24 * 60 * 60 * 1000
		),
		userId,
	});

	await newCoupon.save();
	return newCoupon;
}