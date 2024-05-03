import { NextResponse, NextRequest } from "next/server";
import { PaymentSucceeded } from "./PaymentSucceeded";
import { PaymentFailed } from "./PaymentFailed";
import { PaymentMethodUpdated } from "./PaymentMethodUpdated";
import { CheckoutCompleted } from "./CheckoutCompleted";
import Stripe from "stripe";
const STRIPE_WEBHOOK_SECRET =
  process.env.STRIPE_WEBHOOK_SECRET!;

export const POST = async (request: NextRequest) => {
  // console.log("Payment event from stripe");

  const stripeSignature =
    request.headers.get("stripe-signature") ?? "";
  const body = await request.text();
  const event = Stripe.webhooks.constructEvent(
    body,
    stripeSignature,
    STRIPE_WEBHOOK_SECRET
  ) as any;

  switch (event.type) {
    case "payment_intent.succeeded":
      return PaymentSucceeded(event);
    case "payment_intent.payment_failed":
      return PaymentFailed(event);
    case "checkout.session.completed":
      if (
        event.data.object.metadata.change_payment_method == 1
      ) {
        return PaymentMethodUpdated(event);
      } else {
        return CheckoutCompleted(event);
      }
    default:
      return NextResponse.json(
        { error: "Unhandled event" },
        { status: 200 }
      );
  }
};
