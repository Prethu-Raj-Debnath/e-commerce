import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { IUser } from "./user.model.js";
import { IProduct } from "./product.model.js";

// Define the interface for order product items
export interface IOrderProduct {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

// Define the interface for populated order product items
export interface IOrderProductPopulated {
  product: IProduct;
  quantity: number;
  price: number;
}

// Define the interface for the Order document
export interface IOrder extends Document {
  user: Types.ObjectId;
  products: IOrderProduct[];
  totalAmount: number;
  stripeSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define interface for populated Order (when you use .populate())
export interface IOrderPopulated extends Omit<IOrder, "user" | "products"> {
  user: IUser;
  products: IOrderProductPopulated[];
}

// Define the schema
const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    stripeSessionId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Create and export the model with proper typing
const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);

export default Order;