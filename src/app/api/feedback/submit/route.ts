import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as FeedbackService from "@/lib/services/FeedbackService";

export const POST = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Submit Feedback route called");
    const user = request.user;

    const { message, requestHistory } = await request.json();

    await FeedbackService.createFeedback(message, requestHistory, user);

    return NextResponse.json({
      message: "Feedback submitted",
    });
  }
);
