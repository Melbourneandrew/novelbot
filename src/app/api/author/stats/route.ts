import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as AuthorService from "@/lib/services/AuthorService";
import * as CharacterService from "@/lib/services/CharacterService";
import * as ConversationService from "@/lib/services/ConversationService";
import { ICharacter } from "@/lib/models/Character";

export interface CharacterWithStats extends ICharacter {
  totalConversations: number;
  averageConversationLength: number;
}

export interface AuthorStatBoardData {
  readers?: number;
  conversationCount?: number;
  totalMessages?: number;
  averageConversationLength?: number;
  charactersWithStats?: CharacterWithStats[];
}

export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Protected route called");
    const user = request.user;
    const author = await AuthorService.findAuthorByUser(
      user.id
    );
    if (!author) {
      console.log("Author not found");
      return new NextResponse("Author not found", {
        status: 404,
      });
    }
    const readers = await AuthorService.countReaders(
      author._id
    );

    const {
      conversationCount,
      totalMessages,
      averageConversationLength,
    } = await ConversationService.conversationStatsByAuthor(
      author._id
    );

    const charactersWithStats =
      await CharacterService.findCharactersWithStatsByAuthor(
        author._id
      );

    const authorStats: AuthorStatBoardData = {
      readers,
      charactersWithStats,
      totalMessages,
      averageConversationLength,
    };

    return NextResponse.json(authorStats);
  }
);
