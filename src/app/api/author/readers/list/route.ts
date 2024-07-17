import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";

export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Protected route called");
    const user = request.user;
    if (false) {
      return new NextResponse("Protected route call failed", { status: 401 });
    }
    return NextResponse.json({
      message: "Protected route called",
    });
  }
);
