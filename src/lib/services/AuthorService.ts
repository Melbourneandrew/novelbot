import { Author, IAuthor } from "@/lib/models/Author";
import {
  AccessCode,
  IAccessCode,
} from "@/lib/models/AccessCode";
import {
  ReaderEnteredCode,
  IReaderEnteredCode,
} from "@/lib/models/ReaderEnteredCode";
import {
  Conversation,
  IConversation,
} from "@/lib/models/Conversation";
import * as ReaderService from "@/lib/services/ReaderService";

export async function findAuthorById(
  id: string
): Promise<IAuthor | null> {
  //TODO: Implement caching
  return await Author.findById(id);
}

type CreateAuthorParams = {
  user: string;
  penName: string;
};
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

export async function countReaders(
  authorId: string
): Promise<number> {
  const accessCodes = await AccessCode.find({
    author: authorId,
  });

  const readers = await ReaderEnteredCode.find({
    accessCode: {
      $in: accessCodes.map((code) => code._id),
    },
  });

  return readers.length;
}
