import { NextResponse, NextRequest } from "next/server";
import { AuthenticatedNextRequest } from "@/types";

export function ProtectedRoute(authenticator: Function, controller: Function) {
    return (request: NextRequest) => {
        const user = authenticator(request);
        if (!user) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        const authenticatedRequest = request as AuthenticatedNextRequest;
        authenticatedRequest.user = user;
        return controller(authenticatedRequest);
    }
}