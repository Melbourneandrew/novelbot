import { NextResponse, NextRequest } from "next/server";
import { AuthenticatedNextRequest } from "@/types";

export function ProtectedRoute(
  authenticator: Function,
  controller: Function
) {
  return async (request: NextRequest) => {
    const user = await authenticator(request);
    if (!user) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }
    const authenticatedRequest =
      request as AuthenticatedNextRequest;
    authenticatedRequest.user = user;
    return controller(authenticatedRequest);
  };
}
