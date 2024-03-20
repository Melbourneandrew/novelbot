import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  const prices = await stripe.prices.list();
  const plans = await stripe.products.list({
    active: true,
  });

  const plansWithPrices = plans.data.map(
    (plan: Stripe.Product) => {
      let price = prices.data.filter(
        (price: Stripe.Price) => price.product === plan.id
      );
      //Convert to dollars
      price[0].unit_amount = (price[0].unit_amount ?? 0) / 100;
      const planWithPrice = {
        ...plan,
        price: price[0],
      };
      return planWithPrice;
    }
  );

  return NextResponse.json(plansWithPrices);
}
