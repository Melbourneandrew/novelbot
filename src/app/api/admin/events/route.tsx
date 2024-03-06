import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { auth } from "@/lib/auth";
import { Event, IEvent } from "@/lib/models/Event";
export const GET = ProtectedRoute(
  auth,
  async (request: AuthenticatedNextRequest) => {
    console.log("Admin request for all events");
    const events = await Event.find();
    return NextResponse.json({ events });
  }
);
