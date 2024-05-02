import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import { IPurchase, Purchase } from "@/lib/models/Purchase";

//TODO: Change to admin protected route

export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Admin route for all purchases");
    const purchases = await Purchase.find();
    return NextResponse.json({ purchases });
  }
);
