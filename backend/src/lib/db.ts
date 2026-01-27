import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
	try {
		const conn = await mongoose.connect(
			process.env.MONGO_URI as string
		);

		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error connecting to MongoDB:", error.message);
		} else {
			console.error("Unknown error connecting to MongoDB:", error);
		}
		process.exit(1);
	}
};

