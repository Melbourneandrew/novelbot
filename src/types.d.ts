import { JwtPayload } from "jsonwebtoken";
import { IUser } from "@/lib/models/User";
import { NextRequest } from "next/server";

interface SessionTokenInterface extends JwtPayload {
  email: string;
  id: string;
}
interface AuthenticatedNextRequest extends NextRequest {
  user: IUser;
}
interface PurchaseUpdate {
  stripeSubscriptionId?: string;
  pricePaid?: number;
  emailProvided?: string;
}
