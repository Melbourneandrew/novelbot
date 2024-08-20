import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import {
  DialogueByCharacter,
  extractDialogue,
} from "@/lib/book-parser/extract-dialogue";
import { IBook } from "@/lib/models/Book";

export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Protected route called");
    const user = request.user;
    try {
      extractDialogue({
        contentFileLink:
          "https://pub-d83e34d9fafc4ffcbe840bd347e399eb.r2.dev/book_content_8wmbDOIRtorO3eyW",
        _id: "66c14c8148cc4c465822a567",
      } as IBook);
    } catch (e) {
      console.log(e);
      return NextResponse.json({
        e,
      });
    }

    if (false) {
      return new NextResponse("Protected route call failed", {
        status: 401,
      });
    }
    return NextResponse.json({
      message: "Protected route called",
    });
  }
);
