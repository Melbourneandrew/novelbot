import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as AccessCodeService from "@/lib/services/AccessCodeService";
import * as AuthorService from "@/lib/services/AuthorService";

export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Access code list request called");
    const user = request.user;

    const author = await AuthorService.findAuthorByUser(user._id);
    if (!author) {
      return new NextResponse("No author found for this user", {
        status: 400,
      });
    }

    const accessCodes = await AccessCodeService.findAccessCodesByAuthor(
      author._id
    );

    return NextResponse.json({
      accessCodes,
    });
  }
);
