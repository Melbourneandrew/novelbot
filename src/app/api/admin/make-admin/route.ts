import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as UserService from "@/lib/services/UserService";

export const POST = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    const { email } = await request.json();
    const user = await UserService.findUser({ email: email });
    if (!user) {
      return new NextResponse("User not found", {
        status: 404,
      });
    }
    return NextResponse.json({
      message: "User promoted to admin",
    });
  }
);
