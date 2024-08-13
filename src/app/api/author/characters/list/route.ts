import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as AuthorService from "@/lib/services/AuthorService";
import * as CharacterService from "@/lib/services/CharacterService";

export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Character list request");
    const user = request.user;
    const author = await AuthorService.findAuthorByUser(user.id);
    if (!author) {
      console.log("Author not found");
      return new NextResponse("Author not found", {
        status: 404,
      });
    }
    console.log(author);

    let characters = await CharacterService.findCharactersByAuthor(author._id);
    console.log(characters);

    const { searchParams } = new URL(request.url);

    const bookId = searchParams.get("bookId");
    if (bookId) {
      characters = characters.filter((character) => character.book === bookId);
    }

    return NextResponse.json({ characters });
  }
);
