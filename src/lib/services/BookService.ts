import {Book, IBook} from "@/lib/models/Book"

export async function findBookById(
    id: string
): Promise<IBook | null> {
    //TODO: Implement caching
    return await Book.findById(id);
}

export async function createBook(
    book: IBook
): Promise<IBook> {
    const newBook = await Book.create(book);
    return newBook;
}

export async function findBooksByAuthor(
    authorId: string
): Promise<IBook[]> {
    return await Book.find({ author: authorId });
}