import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import { AuthenticatedNextRequest } from "@/types";
import * as SubscriptionService from "@/lib/services/SubscriptionService";
import * as PurchaseService from "@/lib/services/PurchaseService";
import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Request to update payment method");

    const user = request.user;

    let { activeSubscription, stripeSubscriptionObject } =
      await SubscriptionService.getActiveSubscriptionByUser(
        user.id
      );
    if (!activeSubscription || !stripeSubscriptionObject) {
      return NextResponse.json({
        success: false,
        message: "No active subscription found",
      });
    }
    const customerId: string =
      typeof stripeSubscriptionObject.customer === "string"
        ? stripeSubscriptionObject.customer
        : stripeSubscriptionObject.customer.id;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      mode: "setup",
      metadata: {
        customer_id: customerId,
        subscription_id: stripeSubscriptionObject.id,
        change_payment_method: 1,
      },
      success_url: "http://localhost:3000/",
      cancel_url: "http://localhost:3000",
    };

    const checkoutSession =
      await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      url: checkoutSession.url,
    });
  }
);
