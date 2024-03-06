import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { auth } from "@/lib/auth";
import { User, IUser } from "@/lib/models/User"
export const GET = ProtectedRoute(auth, async (request: AuthenticatedNextRequest) => {
    console.log("Admin request for all users")
    const users = await User.find()
    return NextResponse.json({ users })
})
