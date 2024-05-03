import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function PaymentMethodUpdated(
  event: Stripe.Event
) {
  console.log("Payment method update webhook hit: ", event);
  try {
    const eventData = event.data
      .object as Stripe.Checkout.Session;
    const setupIntentId = eventData.setup_intent as string;

    const setupIntent = await stripe.setupIntents.retrieve(
      setupIntentId
    );
    const paymentMethod = setupIntent.payment_method as string;

    const customerId = setupIntent.customer as string;
    const customer = await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethod,
      },
    });

    return NextResponse.json({
      message: "Payment method update succeeded",
    });
  } catch (ex) {
    console.log("Problem updating payment method: ", ex);
    return NextResponse.json(
      { error: "Problem updating payment method" },
      { status: 500 }
    );
  }
}
