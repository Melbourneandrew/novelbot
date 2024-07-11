import { IEvent, Event } from "../models/Event";
import {
  ISubscription,
  Subscription,
} from "../models/Subscription";
import * as EventService from "./EventService";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createSubscription(
  subscription: ISubscription
): Promise<ISubscription> {
  const newSubscription: ISubscription =
    await Subscription.create(subscription);
  const createPurchaseEvent = await EventService.createEvent({
    title: "New subscription created",
    subscription: newSubscription!,
  } as IEvent);
  return await newSubscription.save();
}

export async function getSubscriptionById(
  id: string
): Promise<ISubscription | null> {
  return await Subscription.findById(id);
}

export async function getSubscriptionsByUser(
  userId: string
): Promise<ISubscription[]> {
  return await Subscription.find({ user: userId });
}

export async function getActiveSubscriptionByUser(
  userId: string
): Promise<{
  activeSubscription?: ISubscription;
  stripeSubscriptionObject?: Stripe.Subscription;
  stripeProductObject?: Stripe.Product;
  stripePaymentMethod?: Stripe.PaymentMethod;
}> {
  const subscriptions = await Subscription.find({
    user: userId,
  }).lean();
  const activeSubscription = subscriptions.sort(
    (a, b) => b.createdAt - a.createdAt
  )[0] as ISubscription;
  console.log("Most recent subscription: ", activeSubscription);
  if (!activeSubscription || !activeSubscription.active) {
    console.log("No Active Subscription");
    return {};
  }

  const stripeSubscriptionObject =
    await stripe.subscriptions.retrieve(
      activeSubscription.stripeSubscriptionId || ""
    );

  const stripeProductId = stripeSubscriptionObject.items.data[0]
    .price.product as string;
  const stripeProductObject = await stripe.products.retrieve(
    stripeProductId
  );

  const stripePaymentMethodId =
    stripeSubscriptionObject.default_payment_method as string;
  const stripePaymentMethod =
    await stripe.paymentMethods.retrieve(stripePaymentMethodId);

  return {
    activeSubscription,
    stripeSubscriptionObject,
    stripeProductObject,
    stripePaymentMethod,
  };
}

export async function cancelSubscription(
  activeSubscription: ISubscription,
  stripeSubscriptionObject: Stripe.Subscription
): Promise<boolean | null> {
  if (activeSubscription === undefined) return null;
  if (stripeSubscriptionObject === undefined) return null;

  const subscription = await Subscription.updateOne(
    { _id: activeSubscription._id },
    { active: false, cancelledOn: new Date() }
  );
  if (!subscription) {
    return false;
  }

  if (stripeSubscriptionObject.status === "active") {
    await stripe.subscriptions.cancel(
      stripeSubscriptionObject.id
    );
  }

  await EventService.createEvent({
    title: "Subscription cancelled",
    subscription: activeSubscription._id,
  } as IEvent);

  console.log("Subscription cancelled");
  return true;
}

export async function deleteSubscription(
  id: string
): Promise<ISubscription | null> {
  return await Subscription.findByIdAndDelete(id);
}
