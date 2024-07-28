import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as AuthorService from "@/lib/services/AuthorService";
import * as BookService from "@/lib/services/BookService";
import * as CharacterService from "@/lib/services/CharacterService";
import * as ConversationService from "@/lib/services/ConversationService";

export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    const user = request.user;
    const author = await AuthorService.findAuthorByUser(user.id);
    if (!author) {
      return new NextResponse("Author not found", {
        status: 404,
      });
    }
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");
    if (!bookId) {
      return new NextResponse("Book ID is required", {
        status: 400,
      });
    }
    const book = await BookService.findBookById(bookId);
    if (!book) {
      return new NextResponse("Book not found", {
        status: 404,
      });
    }

    const characters = await CharacterService.findCharactersByBook(bookId);

    const conversationCount =
      await ConversationService.countConversationsByBook(bookId);

    return NextResponse.json({ book, characters });
  }
);
