import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as AccessCodeService from "@/lib/services/AccessCodeService";
import * as AuthorService from "@/lib/services/AuthorService";
import * as ReaderService from "@/lib/services/ReaderService";
import { IAccessCode } from "@/lib/models/AccessCode";
import { ICharacter } from "@/lib/models/Character";

export const POST = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Protected route called");
    const user = request.user;
    const author = await AuthorService.findAuthorByUser(user._id);

    if (!author) {
      return new NextResponse("No author found for this user", {
        status: 400,
      });
    }

    const {
      codeName,
      codeValue,
      selectedCharacterOptions,
      expirationDate,
      neverExpires,
    } = await request.json();

    if (
      !codeName ||
      !codeValue ||
      !selectedCharacterOptions ||
      !expirationDate
    ) {
      return new NextResponse("Incomplete request parameters", {
        status: 400,
      });
    }

    const expirationDateObject = new Date(expirationDate);
    if (neverExpires) {
      expirationDateObject.setFullYear(
        expirationDateObject.getFullYear() + 100
      );
    }

    try {
      await AccessCodeService.createAccessCode({
        name: codeName,
        code: codeValue,
        characters: selectedCharacterOptions.map(
          (character: ICharacter) => character._id
        ),
        author: author._id,
        expires: expirationDateObject,
      } as IAccessCode);
      console.log("Access code created");

      /* 
        We want all the access codes an author creates to be automatically added to their reader account.
        This way they can demo all their published characters.
      */
      const authorReaderAccount = await ReaderService.findReaderByUserId(
        user._id
      );
      if (!authorReaderAccount) {
        return new NextResponse(
          "No reader account found for this author. (This should never happen)",
          {
            status: 400,
          }
        );
      }
      await ReaderService.createReaderEnteredCode(
        authorReaderAccount._id,
        codeValue
      );
      console.log("Added access code to author's reader account");

      return NextResponse.json({
        message: "Access code created",
      });
    } catch (error) {
      console.error(error);
      return new NextResponse("Error creating access code record:" + error, {
        status: 500,
      });
    }
  }
);
