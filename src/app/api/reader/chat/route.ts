import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as ReaderService from "@/lib/services/ReaderService";
import * as CharacterService from "@/lib/services/CharacterService";
import * as ConversationService from "@/lib/services/ConversationService";
import { ICharacter } from "@/lib/models/Character";
import { IConversation } from "@/lib/models/Conversation";

export const POST = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Chat route called");
    const user = request.user;

    const reader = await ReaderService.findReaderByUserId(user._id);
    if (!reader) {
      return new NextResponse("Reader not found", {
        status: 401,
      });
    }

    const { characterId, conversationId, messages } = await request.json();

    if (!messages) {
      return new NextResponse("Messages are required", {
        status: 400,
      });
    }

    let conversation: IConversation | null;
    let character: ICharacter | null;

    if (!conversationId) {
      console.log(
        "No conversation Id on request. Creating a new conversation..."
      );
      character = await CharacterService.findCharacterById(characterId);
      if (!character) {
        return new NextResponse("Character not found", {
          status: 404,
        });
      }
      const systemMessage = await ConversationService.buildSystemMessage(
        character
      );

      messages.unshift(systemMessage);

      conversation = await ConversationService.createConversation(
        reader._id,
        character._id,
        messages
      );
    } else {
      console.log(
        "Conversation Id present on request. Continuing conversation..."
      );
      conversation = await ConversationService.findConversationById(
        conversationId
      );
      if (!conversation) {
        return new NextResponse("Conversation not found", {
          status: 404,
        });
      }
    }

    await ConversationService.getCompletion(messages);

    conversation = await ConversationService.addMessagesToConversation(
      conversation._id,
      messages
    );

    return NextResponse.json({
      conversation,
    });
  }
);
