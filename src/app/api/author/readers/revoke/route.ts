import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as AuthorService from "@/lib/services/AuthorService";
import * as ReaderService from "@/lib/services/ReaderService";
export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Revoke reader access route called");
    const user = request.user;

    const author = await AuthorService.findAuthorByUser(
      user._id
    );
    if (!author) {
      return new NextResponse(
        "Only authors can access this route",
        {
          status: 403,
        }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const readerId = searchParams.get("readerId");
    if (!readerId) {
      return new NextResponse("Reader ID is required", {
        status: 400,
      });
    }

    const reader = await ReaderService.findReaderById(readerId);
    if (!reader) {
      return new NextResponse("Reader not found", {
        status: 404,
      });
    }

    const revokeAccess = await ReaderService.revokeAccess(
      readerId
    );
    if (!revokeAccess) {
      return new NextResponse(
        "Failed to revoke reader access",
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      message: "Reader access revoked",
    });
  }
);
