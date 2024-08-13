import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as ReaderService from "@/lib/services/ReaderService";
import * as AuthorService from "@/lib/services/AuthorService";
import * as CharacterService from "@/lib/services/CharacterService";
import { ICharacter } from "@/lib/models/Character";
import { Author } from "@/lib/models/Author";

export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Reader available character list route called");
    const user = request.user;

    const reader = await ReaderService.findReaderByUserId(
      user._id
    );
    if (!reader) {
      return new NextResponse("Reader not found", {
        status: 401,
      });
    }
    const author = await AuthorService.findAuthorByUser(
      user._id
    );
    let characters: ICharacter[] = [];

    // If the user is an author, they can see all their characters
    if (author) {
      characters =
        await CharacterService.findCharactersByAuthor(
          author._id.toString()
        );
    } else {
      characters = await ReaderService.findCharactersByReader(
        reader._id.toString()
      );
    }

    return NextResponse.json({
      characters,
    });
  }
);
