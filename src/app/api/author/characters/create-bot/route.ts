import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as AuthorService from "@/lib/services/AuthorService";
import * as CharacterService from "@/lib/services/CharacterService";
import * as ConversationService from "@/lib/services/ConversationService";
import { generateCharacterDescriptionAndBackstory } from "@/lib/book-parser/generate-character";
import { Character } from "@/lib/models/Character";
import { upsertText } from "@/lib/retrieval/upsert";
import { connectPinecone } from "@/lib/retrieval/vector-db";

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

    const character = await CharacterService.findCharacterWithBookById(
      characterId
    );
    if (!character) {
      return new NextResponse("Character not found", {
        status: 404,
      });
    }

    (async () => {
      connectPinecone();
      const characterInfo = await generateCharacterDescriptionAndBackstory(
        character
      );
      CharacterService.addCharacterDescriptionAndBackstory(
        characterId,
        characterInfo
      );
      const dialogue = await CharacterService.findDialogueByCharacter(
        characterId
      );
      const dialogueText = dialogue.map((d) => d.text);
      upsertText(dialogueText, characterId);
    })();
    // console.log("Generated description: ", description);
    // console.log("Generated backstory: ", backstory);

    // // Mock character creation process
    // await CharacterService.generateRandomDescription(
    //   characterId
    // );
    // await CharacterService.generateRandomBackstory(characterId);

    // await CharacterService.deleteDialogue(characterId);
    // for (let i = 0; i < 10; i++) {
    //   await CharacterService.generateRandomDialogue(
    //     character.book as string,
    //     characterId
    //   );
    // }
    // // for (let i = 0; i < 25; i++) {
    // //   await ConversationService.generateRandomConversation(characterId);
    // // }

    return NextResponse.json({
      message: "Character generation started",
    });
  }
);
