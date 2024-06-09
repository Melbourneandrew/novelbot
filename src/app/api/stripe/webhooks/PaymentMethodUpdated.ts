/*
Checkout session is created to update the payment method for a subscription. The session is created in setup mode, which allows the user to add a new payment method to their account. The session is created with the customer ID and subscription ID as metadata. The session is then returned to the client, which redirects the user to the Stripe checkout page to add a new payment method. The session is then used to update the payment method on the customer and subscription objects in the database. If the update is successful, a success message is returned to the client. If there is an error, an error message is returned to the client.
*/
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
    const customerId = eventData?.metadata
      ?.customer_id as string;
    //Update both the customer and the subscription. Only one is needed.
    const customer = await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethod,
      },
    });
    if (!customer) {
      return NextResponse.json(
        {
          error: "Problem updating payment method on user",
        },
        { status: 500 }
      );
    }
    const subscriptionid = eventData?.metadata
      ?.subscription_id as string;
    const subscription = await stripe.subscriptions.update(
      subscriptionid,
      {
        default_payment_method: paymentMethod,
      }
    );
    if (!subscription) {
      return NextResponse.json(
        {
          error: "Problem updating payment method on customer",
        },
        { status: 500 }
      );
    }

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
