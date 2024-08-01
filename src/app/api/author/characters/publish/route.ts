import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as AuthorService from "@/lib/services/AuthorService";
import * as CharacterService from "@/lib/services/CharacterService";

export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Publish Character Route Called");
    const user = request.user;
    const author = await AuthorService.findAuthorByUser(user.id);
    if (!author) {
      return new NextResponse("Author not found", { status: 404 });
    }

    const characterId = request.nextUrl.searchParams.get("characterId");
    if (!characterId) {
      return new NextResponse("Character id is required", { status: 400 });
    }

    const [published, err] = await CharacterService.publishCharacter(
      characterId
    );

    if (!published) {
      return new NextResponse("Character not published: " + err, {
        status: 500,
      });
    }
    return NextResponse.json({
      message: "Character Published",
    });
  }
);
