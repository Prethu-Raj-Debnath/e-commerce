import mongoose, { Schema, Document, Model } from "mongoose";

// 1️⃣ Coupon document interface
export interface CouponDocument extends Document {
	code: string;
	discountPercentage: number;
	expirationDate: Date;
	isActive: boolean;
	userId: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

// 2️⃣ Schema
const couponSchema = new Schema<CouponDocument>(
	{
		code: {
			type: String,
			required: true,
			unique: true,
		},
		discountPercentage: {
			type: Number,
			required: true,
			min: 0,
			max: 100,
		},
		expirationDate: {
			type: Date,
			required: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
	},
	{
		timestamps: true,
	}
);

// 3️⃣ Model
const Coupon: Model<CouponDocument> =
	mongoose.models.Coupon ||
	mongoose.model<CouponDocument>("Coupon", couponSchema);

export default Coupon;
