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
  authorPenName: string;
  readerCount?: number;
  conversationCount?: number;
  totalMessages?: number;
  averageConversationLength?: number;
  charactersWithStats?: CharacterWithStats[];
}

export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Author stats route called");
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
    const authorPenName = author.penName;

    const readerCount = Math.max(
      0,
      (await AuthorService.countReaders(
        author._id.toString()
      )) - 1
    ); // Subtract 1 to exclude the author

    const {
      conversationCount,
      totalMessages,
      averageConversationLength,
    } = await ConversationService.conversationStatsByAuthor(
      author._id.toString()
    );

    const charactersWithStats =
      await CharacterService.findCharactersWithStatsByAuthor(
        author._id.toString()
      );

    const authorStats: AuthorStatBoardData = {
      authorPenName,
      readerCount,
      charactersWithStats,
      conversationCount,
      totalMessages,
      averageConversationLength,
    };

    return NextResponse.json(authorStats);
  }
);
