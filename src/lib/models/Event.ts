import mongoose, { models, Schema, Document } from "mongoose";
import { IUser } from "./User";
import { IPurchase } from "./Purchase";

interface IEvent extends Document {
  title: string;
  description?: string;
  user?: IUser;
  purchase?: IPurchase;
  createdAt: string;
  updatedAt: string;
}
const eventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    purchase: {
      type: Schema.Types.ObjectId,
      ref: "Purchase",
      required: false,
    },
  },
  { timestamps: true }
);

const EventModel =
  models.Event || mongoose.model<IEvent>("Event", eventSchema);
export { EventModel as Event };
export type { IEvent };
