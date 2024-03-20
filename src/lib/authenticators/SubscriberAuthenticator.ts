import jwt from "jsonwebtoken";
import { SessionTokenInterface } from "@/types";
import { IUser, User } from "@/lib/models/User";
import { NextRequest } from "next/server";
import { connectToDB } from "@/lib/db";
import * as UserService from "@/lib/services/UserService";
export async function SubscriberAuthenticator(
  request: NextRequest
): Promise<IUser | null> {
  console.log("Authenticating...");
  await connectToDB();
  try {
    const cookie = request.cookies.get("session");
    if (!cookie) {
      console.log("Authentication Error: No session token");
      return null;
    }
    const session: SessionTokenInterface = jwt.verify(
      cookie.value,
      process.env.JWT_SECRET!
    ) as SessionTokenInterface;

    const user: IUser | null = await UserService.findUserById(
      session.id
    );

    if (user && user.isAdmin == true) {
      console.log("Authenticated");
      return user;
    } else {
      console.log(
        "Authentication Error: User not found or not an admin"
      );
      return null;
    }
  } catch (error) {
    console.log("Authentication Error:");
    console.log(error);
    return null;
  }
}
