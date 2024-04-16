import mongoose, { models, Schema, Document } from "mongoose";
import { ISubscription } from "./Subscription";

interface IUser extends Document {
  email?: string;
  password?: string;
  isAdmin: boolean;
  isVerified: boolean;
  settings: Settings;
  createdAt: string;
  updatedAt: string;
}
interface Settings {
  theme: string;
  language: string;
}

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    settings: {
      theme: {
        type: String,
        required: true,
        default: "light",
      },
      language: {
        type: String,
        required: true,
        default: "en",
      },
    },
  },
  { timestamps: true }
);

const UserModel =
  models.User || mongoose.model<IUser>("User", userSchema);
export { UserModel as User };
export type { IUser };
