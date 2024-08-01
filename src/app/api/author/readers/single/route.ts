import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as AuthorService from "@/lib/services/AuthorService";
import * as ReaderService from "@/lib/services/ReaderService";
import * as AccessCodeService from "@/lib/services/AccessCodeService";
import * as ConversationService from "@/lib/services/ConversationService";
export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Single reader route called");
    const user = request.user;

    const author = await AuthorService.findAuthorByUser(
      user.id
    );
    if (!author) {
      return new NextResponse("Author not found", {
        status: 404,
      });
    }
    const searchParams = request.nextUrl.searchParams;
    const readerId = searchParams.get("readerId");
    if (!readerId) {
      return new NextResponse("Reader id is required", {
        status: 400,
      });
    }

    const reader = await ReaderService.findReaderById(readerId);
    if (!reader) {
      return new NextResponse("Reader not found", {
        status: 404,
      });
    }

    const accessCodes =
      await AccessCodeService.findAccessCodesByReaderId(
        readerId
      );
    if (!accessCodes) {
      return new NextResponse("Access codes not found", {
        status: 404,
      });
    }

    const conversationCount =
      await ConversationService.countConversationsByReader(
        readerId
      );

    return NextResponse.json({
      reader,
      accessCodes,
      conversationCount,
    });
  }
);
