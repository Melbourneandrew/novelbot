import {Author, IAuthor} from "@/lib/models/Author"

export async function findAuthorById(
    id: string
): Promise<IAuthor | null> {
    //TODO: Implement caching
    return await Author.findById(id);
}

type CreateAuthorParams = {
    user: string;
    penName: string;
}
export async function createAuthor(
    author: CreateAuthorParams
): Promise<IAuthor> {
    const newAuthor = await Author.create(author);
    return newAuthor;
}

export async function findAuthorByUser(
    userId: string
): Promise<IAuthor | null> {
    return await Author.findOne({ user: userId });
}