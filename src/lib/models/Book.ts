import mongoose, { models, Schema, Document } from "mongoose";
import { IAuthor } from "./Author";

interface IBook extends Document {
  title: string;
  summary?: string;
  author: IAuthor | string;
  contentFileLink: string;
  thumbnailFileLink: string;
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
    contentFileLink: { type: String, required: false },
    thumbnailFileLink: {
      type: String,
      default:
        "https://pub-d83e34d9fafc4ffcbe840bd347e399eb.r2.dev/book_thumbnail_ac2MtV90lgshIHsY",
    },
  },
  { timestamps: true }
);

const BookModel =
  models.Book || mongoose.model<IBook>("Book", bookSchema);
export { BookModel as Book };
export type { IBook };
