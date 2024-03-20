import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as UserService from "@/lib/services/UserService";

export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Admin request for admin users");
    const users = await UserService.findUsers({
      isAdmin: true,
    });
    return NextResponse.json({ users });
  }
);
