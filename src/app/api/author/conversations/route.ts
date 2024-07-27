import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as ConversationService from "@/lib/services/ConversationService";
import * as CharacterService from "@/lib/services/CharacterService";
import * as AuthorService from "@/lib/services/AuthorService";
import * as BookService from "@/lib/services/BookService";
import * as ReaderService from "@/lib/services/ReaderService";

export const POST = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    const user = request.user;
    const author = await AuthorService.findAuthorByUser(user._id);
    if (!author) {
      return new NextResponse("Only authors can search conversation history", {
        status: 403,
      });
    }

    const requestBody = await request.json();
    let { characterId, bookId, readerId, authorId } = requestBody;
    console.log("Conversation history requested with filter: ", {
      characterId,
      bookId,
      readerId,
      authorId,
    });

    let permission = true;
    //Check that author has permission to view the requested conversation history
    if (authorId) {
      const authorPermission = authorId === author._id;
      if (!authorPermission) {
        return new NextResponse(
          "You do not have permission to view this conversation history",
          { status: 403 }
        );
      }
    }
    if (characterId) {
      const characterPermission =
        await CharacterService.verifyCharacterBelongsToAuthor(
          characterId,
          author._id.toString()
        );
      if (!characterPermission) {
        return new NextResponse(
          "You do not have permission to view this conversation history",
          { status: 403 }
        );
      }
    }
    if (bookId) {
      const bookPermission = await BookService.verifyBookBelongsToAuthor(
        bookId,
        author._id.toString()
      );
      if (!bookPermission) {
        return new NextResponse(
          "You do not have permission to view this conversation history",
          { status: 403 }
        );
      }
    }
    if (readerId) {
      const readerPermission = await ReaderService.verifyReaderBelongsToAuthor(
        readerId,
        author._id.toString()
      );
      if (!readerPermission) {
        return new NextResponse(
          "You do not have permission to view this conversation history",
          { status: 403 }
        );
      }
    }
    //If no filters are specified, return all conversations for the author
    if (!bookId && !characterId && !readerId && !authorId) {
      authorId = author._id.toString();
    }
    const conversations = await ConversationService.findConversations({
      characterId,
      bookId,
      readerId,
      authorId,
    });

    return NextResponse.json({
      conversations,
    });
  }
);
