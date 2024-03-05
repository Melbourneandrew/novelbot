import mongoose, { models, Schema, Document } from "mongoose";
import { IUser } from "./User";

interface IPurchase extends Document {
  user: Object;
  stripeSubscriptionId: string;
}
const purchaseSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stripeSubscriptionId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PurchaseModel =
  models.Purchase ||
  mongoose.model<IPurchase>("Purchase", purchaseSchema);
export { PurchaseModel as Purchase };
export type { IPurchase };
