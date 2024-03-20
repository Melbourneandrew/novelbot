import { IUser, User } from "../models/User";
import { IEvent, Event } from "../models/Event";
import { IPurchase, Purchase } from "../models/Purchase";
import { PurchaseUpdate } from "@/types";

export async function createPurchase(
  purchase: IPurchase
): Promise<IPurchase> {
  const newPurchase = await Purchase.create(purchase);
  const createPurchaseEvent = await Event.create({
    title: "New purchase created",
    purchase: newPurchase,
  } as IEvent);
  return newPurchase;
}
export async function completePurchase(
  purchaseId: string,
  update: PurchaseUpdate
): Promise<IPurchase | null> {
  const purchase = await Purchase.findByIdAndUpdate(purchaseId);
  if (!purchase) return null;
  purchase.stripeSubscriptionId = update.stripeSubscriptionId;
  purchase.pricePaid = update.pricePaid;
  purchase.emailProvided = update.emailProvided;
  purchase.completed = true;

  const completedEvent = await Event.create({
    title: "Purchase completed",
    purchase: purchase,
  } as IEvent);

  return await purchase.save();
}
export async function findPurchaseById(
  id: string
): Promise<IPurchase | null> {
  //TODO: Implement caching
  return await Purchase.findOne({ _id: id })
    .populate("user")
    .lean();
}
export async function findPurchases(
  filter: Object
): Promise<IPurchase[]> {
  return await Purchase.find(filter).populate("user").lean();
}
