import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as AuthorService from "@/lib/services/AuthorService";
import * as ReaderService from "@/lib/services/ReaderService";
import { read } from "fs";

export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("List readers route called");
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

    const readers = await ReaderService.findReadersByAuthor(
      author._id
    );

    const readersWithAuthorDesignated = readers.map((reader) =>
      reader.user.toString() == user._id.toString()
        ? {
            ...reader,
            displayName: reader.displayName + " (You)",
          }
        : reader
    );

    return NextResponse.json({
      readers: readersWithAuthorDesignated,
    });
  }
);
