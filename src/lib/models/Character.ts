import mongoose, { models, Schema, Document } from "mongoose";
import { IBook } from "./Book";

interface ICharacter extends Document {
  name: string;
  description?: string;
  lore?: string;
  book: IBook | string;
  profilePictureLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

const characterSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    lore: { type: String, required: false },
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    profilePictureLink: {
      type: String,
      default: "https://www.webwise.ie/wp-content/uploads/2020/12/IMG1207.jpg",
    },
  },
  { timestamps: true }
);

const CharacterModel =
  models.Character || mongoose.model<ICharacter>("Character", characterSchema);
export { CharacterModel as Character };
export type { ICharacter };
