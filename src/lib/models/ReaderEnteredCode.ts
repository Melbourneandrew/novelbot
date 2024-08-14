/**
 * When a reader enteres an access code, a mapping between the reader and the access code is created.
 * "ReaderEnteredCode" is the junction/bridge table for this mapping
 */
import mongoose, { models, Schema, Document } from "mongoose";
import { IAccessCode } from "./AccessCode";
import { IReader } from "./Reader";

interface IReaderEnteredCode extends Document {
  reader: IReader | string;
  accessCode: IAccessCode | string;
  accessRevoked: boolean;
}

const ReaderEnteredCodeSchema: Schema = new Schema(
  {
    reader: {
      type: Schema.Types.ObjectId,
      ref: "Reader",
      required: true,
    },
    accessCode: {
      type: Schema.Types.ObjectId,
      ref: "AccessCode",
      required: true,
    },
    accessRevoked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const ReaderEnteredCodeModel =
  models.ReaderEnteredCode ||
  mongoose.model<IReaderEnteredCode>(
    "ReaderEnteredCode",
    ReaderEnteredCodeSchema
  );
export { ReaderEnteredCodeModel as ReaderEnteredCode };
export type { IReaderEnteredCode };
