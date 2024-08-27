import { IBook } from "../models/Book";
import { ICharacter } from "../models/Character";
import {
  chunkText,
  extractJsonFromCompletion,
  fetchBookContent,
} from "./extract-dialogue";
import Groq from "groq-sdk";
if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY must be set");
}
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export type CharacterInfo = {
  description: string;
  backstory: string;
};

export async function generateCharacterDescriptionAndBackstory(
  character: ICharacter
): Promise<CharacterInfo> {
  const contentFileLink = (character.book as IBook)
    .contentFileLink;

  const bookContent = await fetchBookContent(contentFileLink);
  const chunks = await chunkText(bookContent, 5000);

  let chunkRetries = 0;
  let characterInfo = {
    description: "",
    backstory: "",
  };
  let completion = "";
  for (let i = 0; i < chunks.length; i++) {
    console.log(
      "Processing chunk " +
        i +
        " of " +
        chunks.length +
        " with length " +
        chunks[i].length
    );
    const { systemPrompt, userPrompt } = buildPrompt(
      chunks[i],
      character.name,
      characterInfo.description,
      characterInfo.backstory
    );
    try {
      const completionResponse = await getGroqChatCompletion(
        systemPrompt,
        userPrompt
      );
      completion =
        completionResponse.choices[0]?.message?.content || "";
    } catch (e) {
      console.error(
        "Failed to get completion. Retrying completion."
      );
      i -= 1;
      continue;
    }

    try {
      characterInfo = extractJsonFromCompletion(completion);
    } catch (e) {
      console.error(
        "Failed to parse JSON. Retrying completion. Chunk retries: " +
          ++chunkRetries
      );
      console.log("Completion: ", completion);
      i -= 1;
      continue;
    }
    chunkRetries = 0;
  }
  console.log(
    "Generated description: ",
    characterInfo.description
  );
  console.log("Generated backstory: ", characterInfo.backstory);

  return characterInfo;
}

async function getGroqChatCompletion(
  systemPrompt: string,
  userPrompt: string
) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    model: "llama-3.1-70b-versatile",
    temperature: 0,
  });
}

function buildPrompt(
  chunk: string,
  characterName: string,
  characterDescription: string,
  characterBackstory: string
) {
  const systemPrompt = `
    You are reading a book and writing a description and backstory for a particular 
    character. The character's name is ${characterName}. The description 
    should be a few sentences long and describe the character's appearance, personality, 
    and any other relevant details. The backstory should be a few sentences long 
    and describe the character's history, motivations, and any other relevant details.
    If the current text you are reading does not provide enough information to update the description and backstory,
    you can make up details based on the text you have read.
    The description and backstory will be provided in JSON format. Here is an example:
    {
      "description": "The character is tall and has brown hair. They are friendly and outgoing.",
      "backstory": "The character grew up in a small town and always dreamed of traveling the world."
    }
      You will be provided with an existing description and backstory for the character that you have written previously,
      and you will update it with new information based on the text you read. You will respond ONLY in JSON format.
    `;

  const userPrompt = `
    Here is the existing description and backstory for the character:
    {
      "description": "${characterDescription}",
      "backstory": "${characterBackstory}"
    }
    Please update the description and backstory after reading the follwing text: ${chunk}
    `;
  return { systemPrompt, userPrompt };
}
