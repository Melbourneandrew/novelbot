import mongoose, { models, Schema, Document } from "mongoose";
import { IUser } from "./User";

interface IReader extends Document {
  user: IUser | string;
  displayName: string;
}

const readerSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    readingList: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const ReaderModel =
  models.Reader || mongoose.model<IReader>("Reader", readerSchema);
export { ReaderModel as Reader };
export type { IReader };
