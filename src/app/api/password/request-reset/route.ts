import { NextRequest, NextResponse } from "next/server";
import * as UserService from "@/lib/services/UserService";
import { generateRandomString } from "@/lib/util/random";
import { sendEmail } from "@/lib/util/email";
import connectToDB from "@/lib/db";

const APP_URL = process.env.APP_URL;
export async function POST(request: NextRequest) {
  console.log("Password reset request recieved");
  await connectToDB();
  const { email } = await request.json();

  const passwordResetToken = generateRandomString(16);
  const user = await UserService.requestPasswordReset(
    email,
    passwordResetToken
  );
  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const emailSent = await sendEmail(
    email,
    "Password Reset",
    `Reset your password here: ${APP_URL}/reset-password/reset?token=${passwordResetToken}`
  );
  if (!emailSent) {
    return new NextResponse("Failed to send email", { status: 500 });
  }

  return NextResponse.json({ message: "Password reset token sent" });
}
