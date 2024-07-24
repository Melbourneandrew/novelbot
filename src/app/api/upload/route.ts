import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import { r2 } from "@/lib/util/r2";
import { generateRandomString } from "@/lib/util/random";
import { AuthenticatedNextRequest } from "@/types";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const CLOUDFLARE_R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME;

if (!CLOUDFLARE_R2_BUCKET_NAME)
  throw new Error("CLOUDFLARE_R2_BUCKET_NAME must be set");

export const POST = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    try {
      console.log(`Generating an upload URL`);

      const filename = generateRandomString(10);
      const signedUrl = await getSignedUrl(
        r2,
        new PutObjectCommand({
          Bucket: CLOUDFLARE_R2_BUCKET_NAME,
          Key: filename,
        }),
        { expiresIn: 60 }
      );

      console.log(`Success generating upload URL!`);

      return NextResponse.json({ signedUrl });
    } catch (err) {
      console.log("Error generating upload URL: ", err);
      return new NextResponse("Error generating upload URL: " + err, {
        status: 500,
      });
    }
  }
);
