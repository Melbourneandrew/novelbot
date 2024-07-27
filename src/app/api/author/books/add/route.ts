import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import { r2 } from "@/lib/util/r2";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { generateBookContentFileName } from "@/lib/util/random";
import * as BookService from "@/lib/services/BookService";
import * as AuthorService from "@/lib/services/AuthorService";
import * as CharacterService from "@/lib/services/CharacterService";

const CLOUDFLARE_R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME;
if (!CLOUDFLARE_R2_BUCKET_NAME)
  throw new Error("CLOUDFLARE_R2_BUCKET_NAME must be set");

export const POST = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Add book route called");
    const { bookTitle, bookSummary } = await request.json();
    console.log(bookTitle, bookSummary);
    if (!bookTitle || !bookSummary) {
      return new NextResponse("Missing required fields", {
        status: 400,
      });
    }
    const user = request.user;
    const author = await AuthorService.findAuthorByUser(user.id);
    if (!author) {
      return new NextResponse("Author not found", {
        status: 404,
      });
    }

    //Create upload link for book content. Client will upload the PDF.
    const contentFileName = generateBookContentFileName();
    const signedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: CLOUDFLARE_R2_BUCKET_NAME,
        Key: contentFileName,
      }),
      { expiresIn: 60 }
    );

    const book = await BookService.createBook({
      title: bookTitle,
      summary: bookSummary,
      contentFileLink: contentFileName,
      author: author._id,
    });

    //TODO: Process book content
    setTimeout(() => {
      console.log("This runs once after 10 seconds");
    }, 10000);

    //Mock book processing by generating random characters and dialogue
    const characters = await CharacterService.generateRandomCharacters(
      book._id
    );
    characters.forEach(async (characterId) => {
      await CharacterService.generateRandomDialogue(book._id, characterId);
    });

    return NextResponse.json({
      message: "Book added",
      bookId: book._id,
      signedUrl,
    });
  }
);
