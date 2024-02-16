import jwt from "jsonwebtoken";
import { User, IUser } from "@/lib/models/User";
import connectToDB from "@/lib/db";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  await connectToDB();
  try {
    console.log("Signup route called");
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
    const user = await User.findOne({ email });
    if (user) {
      return new NextResponse(
        "User with that email already exists",
        {
          status: 404,
        }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: IUser = new User({
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign(
      {
        email: user.email,
        id: newUser._id,
      },
      process.env.JWT_SECRET!
    );
    return NextResponse.next().cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // One week
      path: "/",
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}
