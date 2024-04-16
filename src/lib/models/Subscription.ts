import mongoose, { models, Schema, Document } from "mongoose";
import { IUser } from "./User";
import { IPurchase } from "./Purchase";
interface ISubscription extends Document {
  stripeSubscriptionId?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
const subscriptionSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    stripeSubscriptionId: {
      type: String,
      required: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const SubscriptionModel =
  models.Subscription ||
  mongoose.model<ISubscription>(
    "Subscription",
    subscriptionSchema
  );
export { SubscriptionModel as Subscription };
export type { ISubscription };
