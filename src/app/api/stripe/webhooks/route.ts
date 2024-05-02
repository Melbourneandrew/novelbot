import { NextResponse, NextRequest } from "next/server";
import { PaymentSucceeded } from "./PaymentSucceeded";
import { PaymentFailed } from "./PaymentFailed";
import { PaymentMethodUpdated } from "./PaymentMethodUpdated";
import Stripe from "stripe";
const STRIPE_WEBHOOK_SECRET =
  process.env.STRIPE_WEBHOOK_SECRET!;

export const GET = async (request: NextRequest) => {
    console.log("Payment event from stripe");

  const stripeSignature =
    request.headers.get("stripe-signature") ?? "";
  const body = await request.text();
  const event = Stripe.webhooks.constructEvent(
    body,
    stripeSignature,
    STRIPE_WEBHOOK_SECRET
  ) as any;
  
  switch(event.type) {
    case "payment_intent.succeeded":
        return PaymentSucceeded(event)
    case "payment_intent.payment_failed":
        return PaymentFailed(event)
    case "checkout.session.completed":
        return PaymentMethodUpdated(event)
    default:
        return NextResponse.json({error: "Unhandled event type"}, {status: 200})
  }        
};