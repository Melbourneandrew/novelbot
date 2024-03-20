import Stripe from "stripe";
import { NextResponse } from "next/server";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import { IPurchase } from "@/lib/models/Purchase";
import { ISubscription } from "@/lib/models/Subscription";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import * as PurchaseService from "@/lib/services/PurchaseService";
import * as SubscriptionService from "@/lib/services/SubscriptionService";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const POST = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    let userId = request.user.id;
    let data = await request.json();
    let priceId = data.priceId;
    let isTrial = data.isTrial;
    let planName = data.planName;

    if (!userId || !priceId || !planName) {
      console.log("Incomplete request", userId, data);
      return NextResponse.json({ error: "Invalid request" });
    }
    console.log(
      "Payment create request received for userId: " +
        userId +
        " priceId: " +
        priceId +
        " isFreeTrial: " +
        isTrial
    );

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: "http://localhost:3000/",
      cancel_url: "http://localhost:3000",
      metadata: {
        userId: userId,
        puchaseId: "",
      },
    };
    if (isTrial) {
      sessionParams.subscription_data = {
        trial_period_days: 30,
      };
    }
    const purchase = await PurchaseService.createPurchase({
      priceId: priceId,
      planName: planName,
    } as IPurchase);

    const session = await stripe.checkout.sessions.create(
      sessionParams
    );
    console.log("Stripe checkout session created: ", session);

    return NextResponse.json(session.url);
  }
);
