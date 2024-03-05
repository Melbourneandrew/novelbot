import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { auth } from "@/lib/auth";
import { IPurchase, Purchase } from "@/lib/models/Purchase";

export const GET = ProtectedRoute(auth, async (request: AuthenticatedNextRequest) => {
    console.log("Admin route for all purchases");
    const purchases = await Purchase.find().populate("user");
    return NextResponse.json(purchases);
})
