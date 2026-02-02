import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/user.model.js";

// Define interfaces
interface DecodedToken extends JwtPayload {
  userId: string;
}

interface AuthRequest extends Request {
  user?: IUser;
}

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("inside this middleware")
  try {
    const authReq = req as AuthRequest;
    const accessToken = req.cookies?.accessToken as string | undefined;
    console.log(accessToken)
    if (!accessToken) {
      res.status(401).json({ message: "Unauthorized - No access token provided" });
      return;
    }

    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as DecodedToken;

      const user = await User.findById(decoded.userId).select("-password") as IUser | null;

      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      authReq.user = user;

      next();
    } catch (error) {
      if (error instanceof Error && error.name === "TokenExpiredError") {
        res.status(401).json({ message: "Unauthorized - Access token expired" });
        return;
      }
      throw error;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.log("Error in protectRoute middleware", errorMessage);
    res.status(401).json({ message: "Unauthorized - Invalid access token" });
  }
};

export const adminRoute = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authReq = req as AuthRequest;
  
  if (authReq.user && authReq.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied - Admin only" });
  }
};