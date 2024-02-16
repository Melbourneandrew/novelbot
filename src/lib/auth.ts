import jwt from "jsonwebtoken";
import { SessionTokenInterface } from "@/types";
import { IUser, User } from "@/lib/models/User";
import { NextRequest } from "next/server";
import { connectToDB } from "@/lib/db";
export async function auth(
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

    const user: IUser | null = await User.findOne({
      _id: session.id,
    });

    if (user) {
      console.log("Authenticated");
      return user;
    } else {
      console.log("Authentication Error: User not found");
      return null;
    }
  } catch (error) {
    console.log("Authentication Error:");
    console.log(error);
    return null;
  }
}
