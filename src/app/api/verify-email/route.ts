import { NextRequest, NextResponse } from "next/server";
import * as UserService from "@/lib/services/UserService"

interface VerifyRequestBody {
    userId: string
}
export async function POST(request: NextRequest) {
    const body: VerifyRequestBody = await request.json() as VerifyRequestBody;
    const userIdForVerification = body.userId;

    const user = await UserService.verifyUser(userIdForVerification);

    if (!user) {
        return new NextResponse("User not found", { status: 404 });
    }
    return NextResponse.json(user);
}
