import mongoose, { models, Schema, Document } from "mongoose";
import { IAuthor } from "./Author";

interface IBook extends Document {
    title: string;
    summary?: string;
    author: IAuthor | string;
    createdAt?: string;
    updatedAt?: string;
}

const bookSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        summary: { type: String, required: false },
        author: {
            type: Schema.Types.ObjectId,
            ref: "Author",
            required: true,
        },
    },
    { timestamps: true }
);

const BookModel = models.Book || mongoose.model<IBook>("Book", bookSchema);
export { BookModel as Book };
export type { IBook };