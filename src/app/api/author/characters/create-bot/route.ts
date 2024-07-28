import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as AuthorService from "@/lib/services/AuthorService";
import * as CharacterService from "@/lib/services/CharacterService";
import * as ConversationService from "@/lib/services/ConversationService";

export const POST = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    const { characterId } = await request.json();
    console.log(
      "Create Character Bot route called for character id: ",
      characterId
    );
    if (!characterId) {
      return new NextResponse("Missing character Id", {
        status: 400,
      });
    }

    const user = request.user;
    const author = await AuthorService.findAuthorByUser(user.id);
    if (!author) {
      return new NextResponse("Author not found", {
        status: 404,
      });
    }

    const character = await CharacterService.findCharacterById(characterId);
    if (!character) {
      return new NextResponse("Character not found", {
        status: 404,
      });
    }

    // Mock character creation process
    await CharacterService.generateRandomDescription(characterId);
    await CharacterService.generateRandomBackstory(characterId);

    await CharacterService.deleteDialogue(characterId);
    for (let i = 0; i < 10; i++) {
      await CharacterService.generateRandomDialogue(
        character.book as string,
        characterId
      );
    }
    for (let i = 0; i < 25; i++) {
      await ConversationService.generateRandomConversation(characterId);
    }

    return NextResponse.json({
      message: "Protected route called",
    });
  }
);
