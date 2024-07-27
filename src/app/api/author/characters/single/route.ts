import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import { AuthenticatedNextRequest } from "@/types";
import * as CharacterService from "@/lib/services/CharacterService";
import * as ConversationService from "@/lib/services/ConversationService";
import { NextResponse } from "next/server";

export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const characterId = searchParams.get("characterId");
    if (!characterId) {
      return new NextResponse("Character ID not provided", { status: 400 });
    }
    const character = await CharacterService.findCharacterById(characterId);
    if (!character) {
      return new NextResponse("Character not found", { status: 404 });
    }
    const dialogue = await CharacterService.findDialogueByCharacter(
      characterId
    );
    const conversationCount =
      await ConversationService.countConversationsByCharacter(characterId);
    return NextResponse.json({ character, dialogue, conversationCount });
  }
);
