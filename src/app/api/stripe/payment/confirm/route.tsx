import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { connectToDB } from "@/lib/db";
import { auth } from "@/lib/auth";
import { IUser, User } from "@/lib/models/User";
import { IPurchase, Purchase } from "@/lib/models/Purchase";

const STRIPE_WEBHOOK_SECRET =
  process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  console.log("Payment confirmation from stripe");

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

    await connectToDB();
    const userId = event.data.object.metadata.userId;
    const user: IUser | null = await User.findById(userId);
    if (!user) {
      console.log("User not found");
      //TODO: Cancel subscription
      return NextResponse.json({ error: "User not found" });
    }

    const purchase = await Purchase.create({
      user: user,
      stripeSubscriptionId: event.data.object.subscription,
    });
    console.log("Purchase created: ", purchase);
    user.stripeSubscriptionId = event.data.object.subscription;
    await user.save();
    await purchase.save();
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Invalid signature" });
  }

  return NextResponse.json({});
}
