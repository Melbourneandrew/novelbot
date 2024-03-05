import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  const prices = await stripe.prices.list();
  const products = await stripe.products.list({
    active: true,
  });

  const productsWithPrices = products.data.map(
    (product: Stripe.Product) => {
      let price = prices.data.filter(
        (price: Stripe.Price) => price.product === product.id
      );
      //Convert to dollars
      price[0].unit_amount = (price[0].unit_amount ?? 0) / 100;
      const productWithPrice = {
        ...product,
        price: price[0],
      };
      return productWithPrice;
    }
  );

  return NextResponse.json(productsWithPrices);
}
