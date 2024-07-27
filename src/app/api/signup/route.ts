import jwt from "jsonwebtoken";
import { User, IUser } from "@/lib/models/User";
import connectToDB from "@/lib/db";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import * as UserService from "@/lib/services/UserService";
import { cookies } from "next/headers";
import { validateEmail, validatePassword } from "@/lib/util/validators";
import * as AuthorService from "@/lib/services/AuthorService";
import * as ReaderService from "@/lib/services/ReaderService";

const JWT_SECRET = process.env.JWT_SECRET!;
const PASSWORD_HASH_ROUNDS = process.env.PASSWORD_HASH_ROUNDS!;
export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const { email, password, role } = reqBody;
  await connectToDB();
  try {
    console.log("Signup route called for: ", email, password, role);
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
    const emailValidation = validateEmail(email);
    if (!emailValidation) {
      return new NextResponse("Invalid email", {
        status: 400,
      });
    }
    const passwordValidation = validatePassword(password);
    if (passwordValidation != "") {
      return new NextResponse(passwordValidation, {
        status: 400,
      });
    }
    let displayName = "";
    if (role === "reader" && !reqBody.displayName) {
      return new NextResponse("Display name is required", {
        status: 400,
      });
    }
    let penName = "";
    if (role === "author" && !reqBody.penName) {
      return new NextResponse("Pen name is required", {
        status: 400,
      });
    }
    const sanatizedEmail = email.toLowerCase().trim();

    const user: IUser | null = await UserService.findUserByEmail(
      sanatizedEmail
    );
    if (user) {
      return new NextResponse("User with that email already exists", {
        status: 404,
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(PASSWORD_HASH_ROUNDS)
    );
    const newUser = await UserService.createUser({
      email: sanatizedEmail,
      password: hashedPassword,
    } as IUser);
    if (!newUser) {
      return new NextResponse("Failed to create new user", {
        status: 500,
      });
    }

    if (role === "author") {
      AuthorService.createAuthor({
        user: newUser._id,
        penName: reqBody.penName,
      });
      console.log("Author created");
      //TODO Also create reader account with author so they can log in as a reader as well
    } else if (role === "reader") {
      ReaderService.createReader({
        user: newUser._id,
        displayName: reqBody.displayName,
      });
      console.log("Reader created");

      //Reader has the option to enter an access code at signup
      if (reqBody.accessCode) {
        const validCode = await ReaderService.createReaderEnteredCode(
          newUser._id,
          reqBody.accessCode
        );
        if (!validCode) {
          return new NextResponse("Invalid access code", {
            status: 400,
          });
        }
        console.log("Added reader entered access code: ", reqBody.accessCode);
      }
    }

    const token = jwt.sign(
      {
        email: newUser.email,
        id: newUser._id,
      },
      JWT_SECRET
    );
    cookies().set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // One week
      path: "/",
    });
    return new NextResponse("Signed in", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}
