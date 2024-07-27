import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as AccessCodeService from "@/lib/services/AccessCodeService";
import * as AuthorService from "@/lib/services/AuthorService";
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
    } catch (error) {
      console.error(error);
      return new NextResponse("Error creating access code record:" + error, {
        status: 500,
      });
    }

    return NextResponse.json({
      message: "Access code created",
    });
  }
);
