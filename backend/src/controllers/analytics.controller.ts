import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

interface AnalyticsData {
	users: number;
	products: number;
	totalSales: number;
	totalRevenue: number;
}

interface DailySalesAgg {
	_id: string; // YYYY-MM-DD
	sales: number;
	revenue: number;
}

interface DailySalesResult {
	date: string;
	sales: number;
	revenue: number;
}


export const getAnalyticsData = async (): Promise<AnalyticsData> => {
	const totalUsers = await User.countDocuments();
	const totalProducts = await Product.countDocuments();

	const salesData = await Order.aggregate<{
		totalSales: number;
		totalRevenue: number;
	}>([
		{
			$group: {
				_id: null,
				totalSales: { $sum: 1 },
				totalRevenue: { $sum: "$totalAmount" },
			},
		},
	]);

	const { totalSales, totalRevenue } =
		salesData[0] ?? { totalSales: 0, totalRevenue: 0 };

	return {
		users: totalUsers,
		products: totalProducts,
		totalSales,
		totalRevenue,
	};
};

export const getDailySalesData = async (
	startDate: Date,
	endDate: Date
): Promise<DailySalesResult[]> => {
	try {
		const dailySalesData = await Order.aggregate<DailySalesAgg>([
			{
				$match: {
					createdAt: {
						$gte: startDate,
						$lte: endDate,
					},
				},
			},
			{
				$group: {
					_id: {
						$dateToString: {
							format: "%Y-%m-%d",
							date: "$createdAt",
						},
					},
					sales: { $sum: 1 },
					revenue: { $sum: "$totalAmount" },
				},
			},
			{ $sort: { _id: 1 } },
		]);
		
		// example of dailySalesData
		// [
		// 	{
		// 		_id: "2024-08-18",
		// 		sales: 12,
		// 		revenue: 1450.75
		// 	},
		// ]

		const dateArray = getDatesInRange(startDate, endDate);

		return dateArray.map((date) => {
			const foundData = dailySalesData.find(
				(item) => item._id === date
			);

			return {
				date,
				sales: foundData?.sales ?? 0,
				revenue: foundData?.revenue ?? 0,
			};
		});
	} catch (error) {
		throw error;
	}
};


function getDatesInRange(startDate: Date, endDate: Date): string[] {
	const dates: string[] = [];
	const currentDate = new Date(startDate);

	while (currentDate <= endDate) {
		dates.push(currentDate.toISOString().split("T")[0]);
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return dates;
}
