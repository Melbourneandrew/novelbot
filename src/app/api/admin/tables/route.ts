import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import mongoose from "mongoose";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import { NextResponse } from "next/server";

export const GET = ProtectedRoute(UserAuthenticator, async (request: AuthenticatedNextRequest) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();

        const countsPromises = collections.map(async (collectionInfo) => {
            const count = await mongoose.connection.db.collection(collectionInfo.name).countDocuments();
            return {
                name: collectionInfo.name,
                count: count,
            };
        });

        const results = await Promise.all(countsPromises);
        return NextResponse.json(results);
    } catch (err) {
        console.error('Error retrieving collections and counts:', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
})