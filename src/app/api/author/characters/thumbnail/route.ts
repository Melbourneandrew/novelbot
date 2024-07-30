import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import { r2 } from "@/lib/util/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import * as AuthorService from "@/lib/services/AuthorService";
import * as CharacterService from "@/lib/services/CharacterService";
import { generateCharacterThumbnailFileName } from "@/lib/util/random";
const CLOUDFLARE_R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME;
if (!CLOUDFLARE_R2_BUCKET_NAME)
  throw new Error("CLOUDFLARE_R2_BUCKET_NAME must be set");

export const POST = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Change Character Thumbnail route called");
    const user = request.user;
    const formData = await request.formData();
    const documentId = formData.get("documentId") as string;
    const thumbnailFile = formData.get("thumbnail") as File;

    if (!thumbnailFile) {
      return new NextResponse("Thumbnail file is required", {
        status: 400,
      });
    }

    if (!documentId) {
      return new NextResponse("Character id is required", {
        status: 400,
      });
    }

    const author = await AuthorService.findAuthorByUser(user.id);
    if (!author) {
      return new NextResponse("Author not found", {
        status: 404,
      });
    }

    const character = await CharacterService.findCharacterById(documentId);
    if (!character) {
      return new NextResponse("Character not found", {
        status: 404,
      });
    }

    const thumbnailFileName = generateCharacterThumbnailFileName();
    const thumbnailFileBuffer = Buffer.from(await thumbnailFile.arrayBuffer());

    const uploaded = await r2.send(
      new PutObjectCommand({
        Bucket: CLOUDFLARE_R2_BUCKET_NAME,
        Key: thumbnailFileName,
        Body: thumbnailFileBuffer,
        ContentType: thumbnailFile.type,
      })
    );

    if (!uploaded) {
      return new NextResponse("Thumbnail upload failed", {
        status: 500,
      });
    }

    await CharacterService.updateCharacterThumbnail(
      documentId,
      thumbnailFileName
    );

    return NextResponse.json({
      message: "Thumbnail uploaded successfully",
    });
  }
);
