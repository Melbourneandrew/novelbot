import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
import { connectToDB } from "@/lib/db";
import { auth } from "@/lib/auth";
import { IUser } from "@/lib/models/User";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  await connectToDB();
  const user: IUser | null = await auth(request);
  if (!user) {
    return NextResponse.redirect(
      new URL("/login", request.nextUrl)
    );
  }

  let data = await request.json();
  let priceId = data.priceId;
  let isTrial = data.isTrial;
  let userId = user._id.toString();
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
    },
  };
  if (isTrial) {
    sessionParams.subscription_data = {
      trial_period_days: 30,
    };
  }

  const session = await stripe.checkout.sessions.create(
    sessionParams
  );
  console.log("Stripe checkout session created: ", session);

  return NextResponse.json(session.url);
}
