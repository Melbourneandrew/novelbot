import mongoose, { models, Schema, Document } from "mongoose";
import { ISubscription } from "./Subscription";
interface IUser extends Document {
  email?: string;
  password?: string;
  subscriptions: ISubscription[];
  isAdmin: boolean;
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
    //Multiple in the event of users who cancel and resubscribe, upgrade, ect.
    //This is a history of subscriptions. Only the most recent should be active.
    subscriptions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subscription",
      },
    ],
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const UserModel =
  models.User || mongoose.model<IUser>("User", userSchema);
export { UserModel as User };
export type { IUser };
