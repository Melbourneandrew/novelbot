import { JwtPayload } from "jsonwebtoken";
import { IUser } from "@/lib/models/User";
import { NextRequest } from "next/server";
interface SessionTokenInterface extends JwtPayload {
  email: string;
  id: string;
}
interface ActionResponse {
  success: boolean;
  message?: string;
  data: any;
}
interface ActionRequest {
  [key: string]: any;
}
interface AuthenticatedNextRequest extends NextRequest {
  user: IUser;
}