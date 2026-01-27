import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/product.model.js";
import { IUser } from "../models/user.model.js";

interface AuthRequest extends Request {
  user: IUser;
}

interface ProductDocument {
  _id: string;
  id: string;
  toJSON(): any;
}

export const getCartProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const products = await Product.find({ 
      _id: { $in: authReq.user.cartItems.map(item => item.product) } 
    }) as ProductDocument[];

    // add quantity for each product
    const cartItems = products.map((product) => {
      const item = authReq.user.cartItems.find(
        (cartItem) => cartItem.product.toString() === product.id
      );
      return { ...product.toJSON(), quantity: item?.quantity || 1 };
    });

    res.json(cartItems);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.log("Error in getCartProducts controller", errorMessage);
    res.status(500).json({ message: "Server error", error: errorMessage });
  }
};
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const { productId } = req.body as { productId: string };
    const user = authReq.user;

    const existingItem = user.cartItems.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push({ product: new mongoose.Types.ObjectId(productId), quantity: 1 });
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.log("Error in addToCart controller", errorMessage);
    res.status(500).json({ message: "Server error", error: errorMessage });
  }
};

export const removeAllFromCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const { productId } = req.body as { productId?: string };
    const user = authReq.user;
    
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
    }
    
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Server error", error: errorMessage });
  }
};

export const updateQuantity = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const { id: productId } = req.params;
    const { quantity } = req.body as { quantity: number };
    const user = authReq.user;
    const existingItem = user.cartItems.find((item) => item.product.toString() === productId);

    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
        await user.save();
        res.json(user.cartItems);
        return;
      }

      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.log("Error in updateQuantity controller", errorMessage);
    res.status(500).json({ message: "Server error", error: errorMessage });
  }
};
