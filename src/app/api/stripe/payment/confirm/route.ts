import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { IUser } from "@/lib/models/User";
import { IPurchase } from "@/lib/models/Purchase";
import { ISubscription } from "@/lib/models/Subscription";
import { PurchaseUpdate } from "@/types";
import * as UserService from "@/lib/services/UserService";
import * as PurchaseService from "@/lib/services/PurchaseService";
import * as SubscriptionService from "@/lib/services/SubscriptionService";
const STRIPE_WEBHOOK_SECRET =
  process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  console.log("Payment event from stripe");

  const stripeSignature =
    request.headers.get("stripe-signature") ?? "";
  const body = await request.text();

  try {
    const event = Stripe.webhooks.constructEvent(
      body,
      stripeSignature,
      STRIPE_WEBHOOK_SECRET
    ) as any;

    if (event.type !== "checkout.session.completed") {
      return NextResponse.json({});
    }
    console.log("Payment confirmed: ", event);

    const userId = event.data.object.metadata.userId;
    const user: IUser | null = await UserService.findUserById(
      userId
    );
    if (!user) {
      console.log("User not found");
      //TODO: Cancel subscription
      return NextResponse.json({ error: "User not found" });
    }
    const purchaseId = event.data.object.metadata.purchaseId;
    const purchase: IPurchase | null =
      await PurchaseService.completePurchase(purchaseId, {
        stripeSubscriptionId: event.data.object.subscription,
        pricePaid: event.data.object.amount_total,
        emailProvided: event.data.object.customer_email,
      } as PurchaseUpdate);

    const subscription: ISubscription =
      await SubscriptionService.createSubscription({
        purchases: [purchase!],
        stripeSubscriptionId: event.data.object.subscription,
        active: true,
      } as ISubscription);

    console.log("Purchase completed: ", purchase);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Invalid signature" });
  }

  return NextResponse.json({});
}
