import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import { uploadImageToR2 } from "@/lib/util/r2";
import * as AuthorService from "@/lib/services/AuthorService";
import * as BookService from "@/lib/services/BookService";
import {
  generateBookThumbnailFileName,
  generateCharacterThumbnailFileName,
} from "@/lib/util/random";
import { Book } from "@/lib/models/Book";
const CLOUDFLARE_R2_BUCKET_NAME =
  process.env.CLOUDFLARE_R2_BUCKET_NAME;
if (!CLOUDFLARE_R2_BUCKET_NAME)
  throw new Error("CLOUDFLARE_R2_BUCKET_NAME must be set");

export const POST = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Change Book Thumbnail route called");
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
      return new NextResponse("Book id is required", {
        status: 400,
      });
    }

    const author = await AuthorService.findAuthorByUser(
      user.id
    );
    if (!author) {
      return new NextResponse("Author not found", {
        status: 404,
      });
    }

    const character = await BookService.findBookById(
      documentId
    );
    if (!character) {
      return new NextResponse("Character not found", {
        status: 404,
      });
    }

    const thumbnailFileName = generateBookThumbnailFileName();
    const uploaded = await uploadImageToR2(
      thumbnailFileName,
      thumbnailFile
    );

    if (!uploaded) {
      return new NextResponse("Thumbnail upload failed", {
        status: 500,
      });
    }

    await BookService.updateBookThumbnail(
      documentId,
      thumbnailFileName
    );

    return NextResponse.json({
      message: "Thumbnail uploaded successfully",
    });
  }
);
