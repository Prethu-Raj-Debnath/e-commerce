import mongoose, { Document, Schema, Model } from "mongoose";

// Define the interface for the Product document
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    category: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create and export the model with proper typing
const Product: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema);

export default Product;