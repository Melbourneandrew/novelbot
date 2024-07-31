import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as ConversationService from "@/lib/services/ConversationService";
import * as AuthorService from "@/lib/services/AuthorService";

export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Single conversation route called");
    const user = request.user;

    const author = await AuthorService.findAuthorByUser(user._id);
    if (!author) {
      //TODO: Switch these to next redirects
      return new NextResponse("Author not authenticated", {
        status: 403,
      });
    }
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");
    if (!conversationId) {
      return new NextResponse("Conversation id is required", {
        status: 400,
      });
    }

    const conversation =
      await ConversationService.findConversationWithCharacterAndReaderById(
        conversationId
      );
    if (!conversation) {
      return new NextResponse("Conversation not found", {
        status: 404,
      });
    }

    return NextResponse.json({
      conversation,
    });
  }
);
