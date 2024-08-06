import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as ReaderService from "@/lib/services/ReaderService";

export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Reader available character list route called");
    const user = request.user;

    const reader = await ReaderService.findReaderByUserId(user._id);
    if (!reader) {
      return new NextResponse("Reader not found", { status: 401 });
    }

    const characters = await ReaderService.findCharactersByReader(reader._id);

    return NextResponse.json({
      characters,
    });
  }
);
