import mongoose, { models, Schema, Document } from "mongoose";
import { IUser } from "./User";
import { IPurchase } from "./Purchase";

interface IEvent extends Document {
    title: string;
    description?: string;
    user?: IUser;
    purchase?: IPurchase
}
const eventSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: "User" },
        purchase: { type: Schema.Types.ObjectId, ref: "Purchase" }

    },
    { timestamps: true }
);

const EventModel =
    models.Purchase ||
    mongoose.model<IEvent>("Event", eventSchema);
export { EventModel as Event };
export type { IEvent };
