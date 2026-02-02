import express, { Request, Response } from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import {
	getAnalyticsData,
	getDailySalesData,
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get(
	"/",
	protectRoute,
	adminRoute,
	async (req: Request, res: Response): Promise<void> => {
		try {
			const analyticsData = await getAnalyticsData();

			const endDate = new Date();
			const startDate = new Date(
				endDate.getTime() - 7 * 24 * 60 * 60 * 1000
			);

			const dailySalesData = await getDailySalesData(startDate, endDate);

			res.json({
				analyticsData,
				dailySalesData,
			});
		} catch (error) {
			const err = error as Error;

			console.error("Error in analytics route", err.message);

			res.status(500).json({
				message: "Server error",
				error: err.message,
			});
		}
	}
);

export default router;
