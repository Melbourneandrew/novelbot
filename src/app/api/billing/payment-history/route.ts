import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import { AuthenticatedNextRequest } from "@/types";
import * as PurchaseService from "@/lib/services/PurchaseService"
import { NextResponse } from "next/server";
export const GET = ProtectedRoute(UserAuthenticator, async (request: AuthenticatedNextRequest) => {
    console.log("Request for user payment history")

    const user = request.user;

    let purchaseHistory = await PurchaseService.findPurchasesByUser(user.id);
    return NextResponse.json(purchaseHistory);
})