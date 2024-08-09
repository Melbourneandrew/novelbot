import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as AuthorService from "@/lib/services/AuthorService";
import * as AccessCodeService from "@/lib/services/AccessCodeService";

export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Remove access code route called");
    const user = request.user;
    const author = await AuthorService.findAuthorByUser(user._id);
    if (!author) {
      return new NextResponse("Author not found", {
        status: 404,
      });
    }
    const searchParams = request.nextUrl.searchParams;
    const accessCodeId = searchParams.get("accessCodeId");
    if (!accessCodeId) {
      return new NextResponse("AccessCodeId id is required", {
        status: 400,
      });
    }

    const removeAccessCode = await AccessCodeService.removeAccessCode(
      accessCodeId
    );
    if (!removeAccessCode) {
      return new NextResponse("Failed to remove access code", {
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Access code removed successfully",
    });
  }
);
