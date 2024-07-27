import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as AuthorService from "@/lib/services/AuthorService";
import { AuthorStatBoardData } from "@/app/author/page";

export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Test route called");
    const user = request.user;
    const author = await AuthorService.findAuthorByUser(user.id);
    if (!author) {
      console.log("Author not found");
      return new NextResponse("Author not found", {
        status: 404,
      });
    }
    const readers = await AuthorService.countReaders(author._id);

    return NextResponse.json({
      message: "Protected route called",
      readers,
    });
  }
);
