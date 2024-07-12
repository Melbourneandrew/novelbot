import { Book, IBook } from "@/lib/models/Book";

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
