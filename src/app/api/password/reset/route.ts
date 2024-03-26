import { NextRequest, NextResponse } from "next/server";
import * as UserService from "@/lib/services/UserService";
import { validatePassword } from "@/lib/util/validators";
import connectToDB from "@/lib/db";

export async function POST(request: NextRequest) {
    console.log("Password reset attempt recieved")
    const { token, newPassword } = await request.json()

    await connectToDB();

    const passwordValidation = validatePassword(newPassword)
    if (passwordValidation != ""){
        return new NextResponse(passwordValidation, { status: 400 })
    }

    const user = await UserService.resetPassword(token, newPassword)
    if (!user) {
        return new NextResponse("Invalid token", { status: 400 })
    }

    return NextResponse.json(user)
}