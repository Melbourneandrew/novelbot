import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as FeedbackService from "@/lib/services/FeedbackService";

//TODO: Switch to admin authenticator
export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("List feedback route called");

    const feedback = await FeedbackService.findAllFeedback();

    return NextResponse.json({
      feedback,
    });
  }
);
