import mongoose, { models, Schema, Document } from "mongoose";
import { ICharacter } from "./Character";

interface IDialogue extends Document {
  character: ICharacter | string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
}

const dialogueSchema: Schema = new Schema(
  {
    character: {
      type: Schema.Types.ObjectId,
      ref: "Character",
      required: true,
    },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const DialogueModel =
  models.Dialogue ||
  mongoose.model<IDialogue>("Dialogue", dialogueSchema);
export { DialogueModel as Dialogue };
export type { IDialogue };
