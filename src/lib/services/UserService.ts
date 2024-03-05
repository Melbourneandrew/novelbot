import { IUser, User } from "../models/User";
import { IEvent, Event } from "../models/Event";

export async function createUser(user: IUser): Promise<IUser> {
    const newUser = await User.create(user);
    const createUserEvent = await Event.create({
        title: "New user created",
        user: newUser
    });
    return newUser;
} 