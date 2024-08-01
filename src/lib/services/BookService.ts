import { Book, IBook } from "@/lib/models/Book";
import { Character, ICharacter } from "@/lib/models/Character";
import { Dialogue, IDialogue } from "@/lib/models/Dialogue";
import { makeR2PublicUrl } from "../util/r2";
import { AccessCode } from "../models/AccessCode";
import { ReaderEnteredCode } from "../models/ReaderEnteredCode";
import { Conversation } from "../models/Conversation";

export async function findBookById(
  id: string
): Promise<IBook | null> {
  //TODO: Implement caching
  return await Book.findById(id);
}

type CreateBookParameters = {
  title: string;
  summary: string;
  contentFileLink: string;
  author: string;
};
export async function createBook(
  book: CreateBookParameters
): Promise<IBook> {
  const newBook = await Book.create(book);
  return newBook;
}

export async function findBooksByAuthor(
  authorId: string
): Promise<IBook[]> {
  return await Book.find({ author: authorId });
}

export async function verifyBookBelongsToAuthor(
  bookId: string,
  authorId: string
): Promise<boolean> {
  const book = await Book.findById(bookId);
  if (!book) {
    return false;
  }
  return book.author.toString() === authorId.toString();
}

const CLOUDFLARE_R2_PUBLIC_URL =
  process.env.CLOUDFLARE_R2_PUBLIC_URL;
if (!CLOUDFLARE_R2_PUBLIC_URL) {
  throw new Error("CLOUDFLARE_R2_PUBLIC_URL must be set");
}

export async function updateBookThumbnail(
  bookId: string,
  thumbnailFileName: string
) {
  return Book.findByIdAndUpdate(
    bookId,
    {
      thumbnailFileLink: makeR2PublicUrl(thumbnailFileName),
    },
    {
      new: true,
    }
  );
}
export async function removeBook(
  bookId: string
): Promise<boolean> {
  const book = await Book.findByIdAndDelete(bookId);
  if (!book) {
    return false;
  }
  const characters = await Character.find({
    book: bookId,
  });
  const characterIds = characters.map((c) => c._id);
  const accessCodes = await AccessCode.find({
    characters: { $in: characterIds },
  });
  const accessCodeIds = accessCodes.map((c) => c._id);
  await Dialogue.deleteMany({
    character: { $in: characterIds },
  });
  await AccessCode.deleteMany({
    id: { $in: accessCodeIds },
  });
  await ReaderEnteredCode.deleteMany({
    accessCode: { $in: accessCodeIds },
  });
  await Conversation.deleteMany({
    character: { $in: characterIds },
  });
  await Character.deleteMany({ id: { $in: characterIds } });

  return true;
}
