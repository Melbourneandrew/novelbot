import { IUser, User } from "../models/User";
import { IEvent, Event } from "../models/Event";
import { IPasswordReset, PasswordReset } from "../models/PasswordReset"
import bcrypt from "bcrypt";

const PASSWORD_HASH_ROUNDS = process.env.PASSWORD_HASH_ROUNDS!;

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

export async function promoteUserToAdmin(email: string): Promise<IUser | null> {
  return await User.findOneAndUpdate(
    { email },
    { isAdmin: true },
    { new: true }
  );
}

export async function verifyUser(userId: string): Promise<IUser | null> {
  return await User.findOneAndUpdate(
    { _id: userId },
    { isVerified: true },
    { new: true }
  ).lean();
}

export async function requestPasswordReset(
  email: string,
  token: string
): Promise<IUser | null> {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }
  await PasswordReset.create({
    user,
    email,
    token
  });
  return user;
}

export async function resetPassword(
  token: string,
  password: string
): Promise<IUser | null> {
  const passwordReset: IPasswordReset | null = await PasswordReset.findOne({ token });
  if (!passwordReset) {
    return null;
  }
  if (passwordReset.expires.getTime() < Date.now()){
    passwordReset.deleteOne();
    return null;
  }

  const user = await User.findById(passwordReset.user);
  user.password = await bcrypt.hash(password, parseInt(PASSWORD_HASH_ROUNDS));

  await user.save();
  await passwordReset.deleteOne();

  const event = await Event.create({
    title: "Password reset",
    user
  });
  return user;
}
