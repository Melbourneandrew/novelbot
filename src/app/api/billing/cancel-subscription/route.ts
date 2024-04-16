import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import { AuthenticatedNextRequest } from "@/types";
import * as SubscriptionService from "@/lib/services/SubscriptionService"
import { NextResponse } from "next/server";
import { ISubscription } from "@/lib/models/Subscription";

export const GET = ProtectedRoute(UserAuthenticator, async (request: AuthenticatedNextRequest) => {
    console.log("Request to cancel subscription subscription")
    
    const user = request.user
    let {activeSubscription, stripeSubscriptionObject} = await SubscriptionService.getActiveSubscriptionByUser(user.id);

    if(!activeSubscription){
        return new NextResponse("No active subscription", {status: 400})
    }
    if(!stripeSubscriptionObject){
        return new NextResponse("Can't find active subscription in stripe", {status: 400})
    }
    if(!activeSubscription.stripeSubscriptionId){
        return new NextResponse("No active subscription id", {status: 400})
    }

    const cancelledSubscription = await SubscriptionService.cancelSubscription(activeSubscription.stripeSubscriptionId)
    if(!cancelledSubscription){
        return new NextResponse("Can't cancel subscription", {status: 400})
    }

    return new NextResponse("Subscription cancelled", {status: 200})
})