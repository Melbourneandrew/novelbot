"use server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { User, IUser } from "@/lib/models/User";
import connectToDB from "@/lib/db";
import bcrypt from "bcrypt";

export async function signup(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  await connectToDB();
  try {
    console.log("Signup action called");
    if (!email) {
      throw new Error("Email is required");
    }
    if (!password) {
      throw new Error("Password is required");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.get("email") as string)) {
      throw new Error("Email is not valid");
    }

    const hashedPassword = await bcrypt.hash(
      password as string,
      10
    );
    const user: IUser = new User({
      email: email,
      password: hashedPassword,
    });
    await user.save();

    //Create a session token, logging in the user.
    const token = jwt.sign(
      {
        email: email,
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
  } catch (error) {
    console.log(error);
  }
  redirect("/dashboard");
}
