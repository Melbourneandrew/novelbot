import mongoose, { models, Schema, Document } from "mongoose";
import { ISubscription } from "./Subscription";

interface IPurchase extends Document {
  planName: string;
  priceId: string;
  subscription: ISubscription;
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
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: false,
    },
    stripeSubscriptionId: {
      type: String,
      required: false,
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
