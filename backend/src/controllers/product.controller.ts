import { Request, Response } from "express";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
import { Types } from "mongoose";

export const getAllProducts = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const products = await Product.find({});
		res.json({ products });
	} catch (error: any) {
		console.log("Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getFeaturedProducts = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const cachedProducts = await redis.get("featured_products");

		if (cachedProducts) {
			res.json(JSON.parse(cachedProducts));
			return;
		}

		const featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts || featuredProducts.length === 0) {
			res.status(404).json({ message: "No featured products found" });
			return;
		}

		await redis.set("featured_products", JSON.stringify(featuredProducts));

		res.json(featuredProducts);
	} catch (error: any) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

interface CreateProductBody {
	name: string;
	description: string;
	price: number;
	image?: string;
	category: string;
}

export const createProduct = async (
	req: Request<{}, {}, CreateProductBody>,
	res: Response
): Promise<void> => {
	try {
		const { name, description, price, image, category } = req.body;

		let cloudinaryResponse: any = null;

		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, {
				folder: "products",
			});
		}

		const product = await Product.create({
			name,
			description,
			price,
			image: cloudinaryResponse?.secure_url ?? "",
			category,
		});

		res.status(201).json(product);
	} catch (error: any) {
		console.log("Error in createProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteProduct = async (
	req: Request<{ id: string }>,
	res: Response
): Promise<void> => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			res.status(404).json({ message: "Product not found" });
			return;
		}

		if (product.image) {
			const publicId = product.image.split("/").pop()?.split(".")[0];
			if (publicId) {
				try {
					await cloudinary.uploader.destroy(`products/${publicId}`);
				} catch (error) {
					console.log("Error deleting image from Cloudinary", error);
				}
			}
		}

		await Product.findByIdAndDelete(req.params.id);

		res.json({ message: "Product deleted successfully" });
	} catch (error: any) {
		console.log("Error in deleteProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};


export const getRecommendedProducts = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const products = await Product.aggregate([
			{ $sample: { size: 4 } },
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		]);

		res.json(products);
	} catch (error: any) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductsByCategory = async (
	req: Request<{ category: string }>,
	res: Response
): Promise<void> => {
	try {
		const { category } = req.params;
		const products = await Product.find({ category });
		res.json({ products });
	} catch (error: any) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const toggleFeaturedProduct = async (
	req: Request<{ id: string }>,
	res: Response
): Promise<void> => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			res.status(404).json({ message: "Product not found" });
			return;
		}

		product.isFeatured = !product.isFeatured;
		const updatedProduct = await product.save();

		await updateFeaturedProductsCache();

		res.json(updatedProduct);
	} catch (error: any) {
		console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

async function updateFeaturedProductsCache(): Promise<void> {
	try {
		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		await redis.set("featured_products", JSON.stringify(featuredProducts));
	} catch (error) {
		console.log("Error updating featured products cache");
	}
}