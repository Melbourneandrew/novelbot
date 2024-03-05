import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { auth } from "@/lib/auth";

export const GET = ProtectedRoute(auth, async (request: AuthenticatedNextRequest) => {
  console.log("Protected route called");
  return NextResponse.json({ message: "Protected route called" });
})
