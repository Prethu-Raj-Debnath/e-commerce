import mongoose, { Document, Schema, Model, CallbackError } from "mongoose";
import bcrypt from "bcryptjs";

// Interface for cart item
interface ICartItem {
  quantity: number;
  product: mongoose.Types.ObjectId;
}

// Interface for User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  cartItems: ICartItem[];
  role: "customer" | "admin";
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
      },
      // {
      //   _id:false,
      // }
    ],
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password before saving to database
userSchema.pre("save", async function (next) {
	 if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
//   if (!this.isModified("password")) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error as CallbackError);
//   }
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;