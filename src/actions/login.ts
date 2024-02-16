"use server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { User, IUser } from "@/lib/models/User";
import connectToDB from "@/lib/db";
import bcrypt from "bcrypt";
export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  await connectToDB();
  try {
    console.log("Login action called");
    if (!email) {
      throw new Error("Email is required");
    }
    if (!password) {
      throw new Error("Password is required");
    }
    const token = jwt.sign(
      {
        email: formData.get("email"),
        id: crypto.randomUUID(),
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
