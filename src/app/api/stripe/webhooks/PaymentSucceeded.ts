import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
import { IUser } from "@/lib/models/User";
import { IPurchase } from "@/lib/models/Purchase";
import { ISubscription } from "@/lib/models/Subscription";
import * as UserService from "@/lib/services/UserService";
import * as PurchaseService from "@/lib/services/PurchaseService";
import * as SubscriptionService from "@/lib/services/SubscriptionService";

export async function PaymentSucceeded(event: Stripe.Event){
    console.log("Payment succeeded: ", event);
    const eventData = event.data.object as Stripe.Checkout.Session;
    const metadata = eventData.metadata!;
    try{
        const userId = metadata.userId;
        const user: IUser | null = await UserService.findUserById(
          userId
        );
        if (!user) {
          console.log("User not found");
          //TODO: Cancel subscription
          return NextResponse.json({ error: "User not found" });
        }


        const purchaseId = metadata.purchaseId;
        const purchase: IPurchase | null =
          await PurchaseService.completePurchase(purchaseId, {
            stripeSubscriptionId: eventData.subscription,
            pricePaid: eventData.amount_total,
            emailProvided: eventData.customer_email,
          } as IPurchase);
    
        const subscription: ISubscription =
          await SubscriptionService.createSubscription({
            stripeSubscriptionId: eventData.subscription,
            active: true,
          } as ISubscription);
    
        console.log("Purchase completed: ", purchase);
      } catch (err) {
        console.log("Issue processing successful payment", err);
        return NextResponse.json({ error: "Issue processing successful payment" }, {status:500});
      }

}