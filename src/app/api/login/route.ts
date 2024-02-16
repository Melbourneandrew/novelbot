import jwt from "jsonwebtoken";
import { User, IUser } from "@/lib/models/User";
import connectToDB from "@/lib/db";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  await connectToDB();
  try {
    console.log("Login route called");
    if (!email) {
      return new NextResponse("Email is required", {
        status: 400,
      });
    }
    if (!password) {
      return new NextResponse("Password is required", {
        status: 400,
      });
    }
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return new NextResponse("User not found", {
        status: 404,
      });
    }
    const match = await bcrypt.compare(
      password,
      user.password!
    );
    if (!match) {
      return new NextResponse("Password is incorrect", {
        status: 401,
      });
    }
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.JWT_SECRET!
    );
    cookies().set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // One week
      path: "/",
    });
    return new NextResponse("Logged in", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}
