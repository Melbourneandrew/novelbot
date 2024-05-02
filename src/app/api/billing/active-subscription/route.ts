import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import { AuthenticatedNextRequest } from "@/types";
import * as SubscriptionService from "@/lib/services/SubscriptionService"
import { NextResponse } from "next/server";
import { ISubscription } from "@/lib/models/Subscription";
import Stripe from "stripe";

export const GET = ProtectedRoute(UserAuthenticator, async (request: AuthenticatedNextRequest) => {
    console.log("Request for user subscription")
    
    const user = request.user
    let {activeSubscription, stripeSubscriptionObject} = await SubscriptionService.getActiveSubscriptionByUser(user.id);

    if(!activeSubscription){
        activeSubscription = {} as ISubscription
    }
    if(!stripeSubscriptionObject){
        stripeSubscriptionObject = {} as Stripe.Subscription
    }

    return NextResponse.json({activeSubscription, stripeSubscriptionObject})
})