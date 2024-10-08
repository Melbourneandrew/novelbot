import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as UserService from "@/lib/services/UserService";

//TODO: Change to admin protected route

export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Admin request for all users");
    const users = await UserService.findUsers({});
    return NextResponse.json({ users });
  }
);
