import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as AuthorService from "@/lib/services/AuthorService";
import * as BookService from "@/lib/services/BookService";
export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Remove book route called");
    const user = request.user;
    const author = await AuthorService.findAuthorByUser(
      user._id
    );
    if (!author) {
      return new NextResponse("Author not found", {
        status: 404,
      });
    }
    const searchParams = request.nextUrl.searchParams;
    const bookId = searchParams.get("bookId");
    if (!bookId) {
      return new NextResponse("Book id is required", {
        status: 400,
      });
    }

    const removeBook = await BookService.removeBook(bookId);
    if (!removeBook) {
      return new NextResponse("Failed to remove book", {
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Book removed successfully",
    });
  }
);
