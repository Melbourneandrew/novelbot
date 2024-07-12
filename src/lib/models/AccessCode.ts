import mongoose, { models, Schema, Document } from "mongoose";
import { IAuthor } from "./Author";
import { ICharacter } from "./Character";
interface IAccessCode extends Document {
  name: string;
  code: string;
  expires: Date;
  author: IAuthor | string;
  characters: ICharacter[] | string[];
  createdAt?: string;
  updatedAt?: string;
}

const accessCodeSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    expires: { type: Date, required: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    characters: [
      {
        type: Schema.Types.ObjectId,
        ref: "Character",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const AccessCodeModel =
  models.AccessCode ||
  mongoose.model<IAccessCode>("AccessCode", accessCodeSchema);
export { AccessCodeModel as AccessCode };
export type { IAccessCode };
