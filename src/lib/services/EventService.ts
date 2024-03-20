import { IUser, User } from "../models/User";
import { IEvent, Event } from "../models/Event";
import { IPurchase, Purchase } from "../models/Purchase";

export async function findEventById(
  id: string
): Promise<IUser | null> {
  //TODO: Implement caching
  return await Event.findById(id);
}

export async function createEvent(
  event: IEvent
): Promise<IEvent> {
  const newEvent = await Event.create(event);
  return newEvent;
}
