import mongoose, { models, Schema, Document } from "mongoose";
import { IUser } from "./User";
interface IFeedback extends Document {
  userMessage: string;
  routeHistory: string[];
  user: IUser;
  createdAt?: string;
  updatedAt?: string;
}

const feedbackSchema: Schema = new Schema(
  {
    userMessage: { type: String, required: true },
    routeHistory: { type: [String], required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const FeedbackModel =
  models.Feedback ||
  mongoose.model<IFeedback>("Feedback", feedbackSchema);
export { FeedbackModel as AccessCode };
export type { IFeedback };
