import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
import { IUser } from "@/lib/models/User";
import { IPurchase } from "@/lib/models/Purchase";
import { ISubscription } from "@/lib/models/Subscription";
import * as UserService from "@/lib/services/UserService";
import * as PurchaseService from "@/lib/services/PurchaseService";
import * as SubscriptionService from "@/lib/services/SubscriptionService";

export async function CheckoutCompleted(event: Stripe.Event) {
  console.log("Checkout completed webhook hit: ", event);
  const eventData = event.data
    .object as Stripe.Checkout.Session;
  const metadata = eventData.metadata!;
  console.log("Metadata: ", metadata);
  try {
    if (eventData.payment_status !== "paid") {
      console.log("Payment status is unpaid");
      return NextResponse.json({
        error: "Payment status not paid",
      });
    }

    const userId = metadata.userId;
    const user: IUser | null = await UserService.findUserById(
      userId
    );
    if (!user) {
      console.log("User not found. Subscription not created.");
      //TODO: Cancel subscription
      return NextResponse.json({ error: "User not found" });
    }
    const subscription: ISubscription =
      await SubscriptionService.createSubscription({
        user: user,
        stripeSubscriptionId: eventData.subscription,
        active: true,
      } as ISubscription);
    console.log("Subscription record created");

    const purchaseId = metadata.purchaseId;
    const purchase: IPurchase | null =
      await PurchaseService.completePurchase(purchaseId, {
        subscription: subscription,
        stripeSubscriptionId: eventData.subscription,
        pricePaid: eventData.amount_total,
        emailProvided: eventData.customer_email,
      } as IPurchase);
    if (!purchase) {
      console.log(
        "Purchase not found. Could not be completed."
      );
      return NextResponse.json({ error: "Purchase not found" });
    }
    console.log("Purchase record completed");

    return NextResponse.json({
      message: "Payment succeeded",
    });
  } catch (err) {
    console.log("Issue processing successful payment", err);
    return NextResponse.json(
      { error: "Issue processing successful payment" },
      { status: 500 }
    );
  }
}
