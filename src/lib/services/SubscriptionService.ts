import { IEvent, Event } from "../models/Event";
import {
  ISubscription,
  Subscription,
} from "../models/Subscription";
import * as EventService from "./EventService";

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
