import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import { Event, IEvent } from "@/lib/models/Event";
import { User } from "@/lib/models/User";
import { Purchase } from "@/lib/models/Purchase";
import * as EventService from "@/lib/services/EventService";
import * as UserService from "@/lib/services/UserService";
import * as PurchaseService from "@/lib/services/PurchaseService";

export const GET = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    const doc = request.nextUrl.searchParams.get("doc");
    const id = request.nextUrl.searchParams.get("id");
    if (!doc || !id) {
      return new NextResponse("Invalid request", {
        status: 400,
      });
    }

    console.log(
      `Admin request for spotlight document with doc: ${doc} and id: ${id}`
    );

    let document: any = null;
    switch (doc) {
      case "Event":
        document = await EventService.findEventById(id);
        break;
      case "User":
        document = await UserService.findUserById(id);
        break;
      case "Purchase":
        document = await PurchaseService.findPurchaseById(id);
    }

    return NextResponse.json({ document });
  }
);
