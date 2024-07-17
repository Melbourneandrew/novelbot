import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as AccessCodeService from "@/lib/services/AccessCodeService";
export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Protected route called");
    const user = request.user;

    const authorId = user.id;
    const author =
      await AccessCodeService.findAccessCodesByAuthor(authorId);
    if (!author) {
      return new NextResponse("No author found for this user", {
        status: 400,
      });
    }

    const accessCodes =
      await AccessCodeService.findAccessCodesByAuthor(authorId);

    return NextResponse.json({
      accessCodes,
    });
  }
);
