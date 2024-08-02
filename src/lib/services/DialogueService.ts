import { Dialogue, IDialogue } from "@/lib/models/Dialogue";

export async function findDialogueById(
  dialogueId: string
): Promise<IDialogue | null> {
  const dialogue = await Dialogue.findById(dialogueId);
  return dialogue;
}

export async function updateDialogueText(
  dialogueId: string,
  updatedText: string
) {
  const dialogue = await Dialogue.findByIdAndUpdate(
    dialogueId,
    { text: updatedText },
    { new: true }
  );
  return dialogue;
}
export async function removeDialogueById(dialogueId: string): Promise<boolean> {
  const removed = await Dialogue.findByIdAndDelete(dialogueId);
  return !!removed;
}
