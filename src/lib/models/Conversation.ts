import mongoose, { models, Schema, Document } from "mongoose";
import { ICharacter } from "./Character";
import { IReader } from "./Reader";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  systemPromptAtTimeOfMessage?: string;
}

interface IConversation extends Document {
  reader: IReader | string;
  character: ICharacter | string;
  messages: Message[];
  createdAt?: string;
  updatedAt?: string;
}

const conversationSchema: Schema = new Schema(
  {
    reader: {
      type: Schema.Types.ObjectId,
      ref: "Reader",
      required: true,
    },
    character: {
      type: Schema.Types.ObjectId,
      ref: "Character",
      required: true,
    },
    messages: {
      type: [
        {
          role: {
            type: String,
            enum: ["user", "assistant", "system"],
            required: true,
          },
          content: {
            type: String,
            required: true,
          },
          systemPromptAtTimeOfMessage: {
            type: String,
            required: false,
          },
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const ConversationModel =
  models.Conversation ||
  mongoose.model<IConversation>("Conversation", conversationSchema);
export { ConversationModel as Conversation };
export type { IConversation, Message };
