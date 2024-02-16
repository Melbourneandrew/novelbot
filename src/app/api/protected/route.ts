import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { auth } from "@/lib/auth";
import { IUser } from "@/lib/models/User";

export async function GET(request: NextRequest) {
  console.log("Protected route called");
  await connectToDB();
  const user: IUser | null = await auth(request);
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  } else {
    console.log("User found");
    return new NextResponse("Hello, World!", { status: 200 });
  }
}
