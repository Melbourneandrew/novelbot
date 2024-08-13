import { NextResponse, NextRequest } from "next/server";
import { AuthenticatedNextRequest } from "@/types";
import { redirect } from "next/navigation";

export function ProtectedRoute(authenticator: Function, controller: Function) {
  return async (request: NextRequest) => {
    const user = await authenticator(request);
    if (!user) {
      console.log("Redirecting to login...");
      return new NextResponse("User could not be authenticated.", {
        status: 401,
      });
    }
    const authenticatedRequest = request as AuthenticatedNextRequest;
    authenticatedRequest.user = user;
    return controller(authenticatedRequest);
  };
}
