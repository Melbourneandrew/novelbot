import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  console.log("Payment failed");
  console.log(request);
}
