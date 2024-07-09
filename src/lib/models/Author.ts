import mongoose, { models, Schema, Document } from "mongoose";
import { IUser } from "./User";

interface IAuthor extends Document {
    user: IUser | string;
    penName: string;
}

const authorSchema: Schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        penName: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);
const AuthorModel = models.Author || mongoose.model<IAuthor>("Author", authorSchema);
export { AuthorModel as Author };
export type { IAuthor };
    
