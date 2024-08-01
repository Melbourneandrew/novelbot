import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as AuthorService from "@/lib/services/AuthorService";
import * as CharacterService from "@/lib/services/CharacterService";

export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Remove character route called");
    const user = request.user;
    const author = await AuthorService.findAuthorByUser(
      user._id
    );
    if (!author) {
      return new NextResponse("Author not found", {
        status: 404,
      });
    }
    const searchParams = request.nextUrl.searchParams;
    const characterId = searchParams.get("characterId");
    if (!characterId) {
      return new NextResponse("Character id is required", {
        status: 400,
      });
    }

    const removeCharacter =
      await CharacterService.removeCharacter(characterId);
    if (!removeCharacter) {
      return new NextResponse("Failed to remove character", {
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Character removed successfully",
    });
  }
);
