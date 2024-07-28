import { Book, IBook } from "@/lib/models/Book";
import { Character, ICharacter } from "@/lib/models/Character";
import { Dialogue, IDialogue } from "@/lib/models/Dialogue";

export async function findBookById(id: string): Promise<IBook | null> {
  //TODO: Implement caching
  return await Book.findById(id);
}

type CreateBookParameters = {
  title: string;
  summary: string;
  contentFileLink: string;
  author: string;
};
export async function createBook(book: CreateBookParameters): Promise<IBook> {
  const newBook = await Book.create(book);
  return newBook;
}

export async function findBooksByAuthor(authorId: string): Promise<IBook[]> {
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
