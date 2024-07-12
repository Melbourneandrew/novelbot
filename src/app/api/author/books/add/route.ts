import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as BookService from "@/lib/services/BookService";
import * as AuthorService from "@/lib/services/AuthorService";

export const POST = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Add book route called");
    const { bookTitle, bookSummary, contentFileLink } = await request.json();
    console.log(bookTitle, bookSummary, contentFileLink);
    if (!bookTitle || !bookSummary || !contentFileLink) {
      return new NextResponse("Missing required fields", {
        status: 400,
      });
    }
    const user = request.user;
    const author = await AuthorService.findAuthorByUser(user.id);
    if (!author) {
      return new NextResponse("Author not found", {
        status: 404,
      });
    }

    const book = await BookService.createBook({
      title: bookTitle,
      summary: bookSummary,
      contentFileLink: contentFileLink,
      author: author._id,
    });

    //TODO: Process book content

    return NextResponse.json({
      message: "Book added",
      bookId: book._id,
    });
  }
);
