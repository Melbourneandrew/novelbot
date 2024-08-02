import { NextResponse } from "next/server";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { AuthenticatedNextRequest } from "@/types";
import { UserAuthenticator } from "@/lib/authenticators/UserAuthenticator";
import * as AuthorService from "@/lib/services/AuthorService";
import * as DialogueService from "@/lib/services/DialogueService";

export const POST = ProtectedRoute(
  UserAuthenticator,
  async (request: AuthenticatedNextRequest) => {
    console.log("Remove Dialogue route called");
    const user = request.user;
    const author = await AuthorService.findAuthorByUser(user._id);
    if (!author) {
      return new NextResponse("Author not found", { status: 404 });
    }

    const { dialogueId } = await request.json();
    if (!dialogueId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const dialogue = await DialogueService.findDialogueById(dialogueId);
    if (!dialogue) {
      return new NextResponse("Dialogue not found", { status: 404 });
    }

    const removedDialogue = await DialogueService.removeDialogueById(
      dialogueId
    );
    if (!removedDialogue) {
      return new NextResponse("Failed to remove dialogue", { status: 500 });
    }

    return NextResponse.json({
      message: "Dialogue removed successfully",
    });
  }
);
