import mongoose, { models, Schema, Document } from "mongoose";
import { IUser } from "./User";
interface ISubscription extends Document {
  user: IUser;
  stripeSubscriptionId?: string;
  active: boolean;
  cancelledOn: Date;
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
    cancelledOn: {
      type: Date,
      default: null,
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
