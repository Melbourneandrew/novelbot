import mongoose, { models, Schema, Document } from "mongoose";
import { IUser } from "./User";
import { ISubscription } from "./Subscription";
interface IPurchase extends Document {
  planName: string;
  priceId: string;
  stripeSubscriptionId?: string;
  pricePaid?: number;
  emailProvided?: string;
  completed?: boolean;
  createdAt: string;
  updatedAt: string;
}
const purchaseSchema: Schema = new Schema(
  {
    planName: {
      type: String,
      required: true,
    },
    priceId: {
      type: String,
      required: true,
    },
    pricePaid: {
      type: Number,
      required: false,
    },
    emailProvided: {
      type: String,
      required: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const PurchaseModel =
  models.Purchase ||
  mongoose.model<IPurchase>("Purchase", purchaseSchema);
export { PurchaseModel as Purchase };
export type { IPurchase };
