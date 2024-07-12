import mongoose, { models, Schema, Document } from "mongoose";
import { IBook } from "./Book";

interface ICharacter extends Document {
    name: string;
    description?: string;
    book: IBook | string;
    createdAt?: string;
    updatedAt?: string;
}

const characterSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: false },
        book: {
            type: Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },
    },
    { timestamps: true }
)

const CharacterModel = models.Character || mongoose.model<ICharacter>("Character", characterSchema);
export { CharacterModel as Character };
export type { ICharacter };