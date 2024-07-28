import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as AuthorService from "@/lib/services/AuthorService";
import * as CharacterService from "@/lib/services/CharacterService";

export const POST = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Update book route called");
    const user = request.user;
    const author = await AuthorService.findAuthorByUser(user._id);
    if (!author) {
      return new NextResponse("Author not authenticated", {
        status: 403,
      });
    }

    const { characterId, characterDescription, characterBackstory } =
      await request.json();

    if (!characterId) {
      return new NextResponse("Character id is required", {
        status: 400,
      });
    }

    if (!characterDescription && !characterBackstory) {
      return new NextResponse(
        "Character description or backstory is required",
        {
          status: 400,
        }
      );
    }

    const authorize = await CharacterService.verifyCharacterBelongsToAuthor(
      characterId,
      author._id
    );
    if (!authorize) {
      return new NextResponse(
        "Author is not authorized to edit this character",
        {
          status: 403,
        }
      );
    }

    const characterUpdated = await CharacterService.updateCharacter(
      characterId,
      characterDescription,
      characterBackstory
    );
    if (!characterUpdated) {
      return new NextResponse("Character could not be updated", {
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Book updated successfully",
    });
  }
);
