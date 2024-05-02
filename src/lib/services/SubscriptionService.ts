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

export async function getSubscriptionById(id: string): Promise<ISubscription | null> {
  return await Subscription.findById(id);
}

export async function getSubscriptionsByUser(userId: string): Promise<ISubscription[]> {
  return await Subscription.find({ user: userId });
}

type SubscriptionResult = { activeSubscription?: ISubscription; stripeSubscriptionObject?: Stripe.Subscription };

export async function getActiveSubscriptionByUser(userId: string): Promise<SubscriptionResult> {
  const subscriptions = await Subscription.find({ user: userId }).lean();
  const activeSubscription = subscriptions.sort((a, b) => b.createdAt - a.createdAt)[0] as ISubscription;

  if (!activeSubscription){
    return {};
  }

  const stripeSubscriptionObject = await stripe.subscriptions.retrieve(activeSubscription.stripeSubscriptionId || "");
  
  return {activeSubscription, stripeSubscriptionObject};
}

export async function cancelSubscription(id: string | undefined): Promise<ISubscription | null> {
  if(id === undefined) return null;

  const subscription = await Subscription.findById(id);
  if (!subscription) {
    return null;
  }
  const stripeSubscriptionObject = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId || "");
  if (stripeSubscriptionObject.status === "active") {
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
  }

  subscription.active = false;
  await subscription.save();

  await EventService.createEvent({
    title: "Subscription cancelled",
    subscription: subscription!,
  } as IEvent);

  return subscription;
}

export async function deleteSubscription(id: string): Promise<ISubscription | null> {
  return await Subscription.findByIdAndDelete(id);
}