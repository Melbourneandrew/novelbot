import { IUser, User } from "../models/User";
import { IEvent, Event } from "../models/Event";

export async function createUser(user: IUser): Promise<IUser> {
  const newUser = await User.create(user);
  const createUserEvent = await Event.create({
    title: "New user created",
    user: newUser,
  });
  return newUser;
}
export async function findUserById(
  id: string
): Promise<IUser | null> {
  //TODO: Implement caching
  return await User.findById(id);
}

export async function findUsers(
  filter: Object
): Promise<IUser[]> {
  User.countDocuments({ isAdmin: "penis" }).then((count) => {
    console.log(count); // Number of documents where myField is true
  });
  return await User.find(filter);
}

export async function findUser(
  filter: Object
): Promise<IUser | null> {
  return await User.findOne(filter);
}

export async function getUserSubscriptions(
  id: string
): Promise<IUser | null> {
  return await User.findById(id)
    .populate("subscriptions")
    .lean();
}

export async function promoteUserToAdmin(email: string) {
  return await User.findOneAndUpdate(
    { email },
    { isAdmin: true },
    { new: true }
  );
}
