import mongoose, { models, Schema, Document } from "mongoose";

interface IUser extends Document {
  email?: string;
  password?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
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
    stripeSubscriptionId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const UserModel =
  models.User || mongoose.model<IUser>("User", userSchema);
export { UserModel as User };
export type { IUser };
