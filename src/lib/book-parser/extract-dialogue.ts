import pdfParse from "pdf-parse";
import Groq from "groq-sdk";
import * as CharacterService from "@/lib/services/CharacterService";
import { IBook } from "../models/Book";
if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY must be set");
}
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function extractDialogue(book: IBook) {
  const { contentFileLink, _id: bookId } = book;
  console.log(
    "Dialogue extraction initiated for book " + bookId
  );
  console.log("Fetching content from " + contentFileLink);
  const bookContent = await fetchBookContent(contentFileLink);
  console.log("Finished fetching content.");
  const chunks = await chunkText(bookContent, 5000);
  console.log(
    "Finished chunking text. Chunk count: " + chunks.length
  );
  const dialogueByCharacter = await sortDialogueByCharacter(
    chunks
  );
  console.log("Finished extracting dialogue");

  console.log(dialogueByCharacter);

  console.log(
    "Adding character and dialogue documents in database"
  );
  await CharacterService.createCharactersFromBookExtraction(
    dialogueByCharacter,
    bookId.toString()
  );
  console.log("Finished creating characters");
}

export async function fetchBookContent(contentLink: string) {
  const response = await fetch(contentLink);
  const pdfData = await pdfParse(
    Buffer.from(await response.arrayBuffer())
  );
  return pdfData.text;
}

export async function chunkText(
  text: string,
  chunkSize: number
): Promise<string[]> {
  const words = text.replace(/\n/g, " ").split(" ");
  const chunks = [];
  let currentChunk = [];

  let iteratorIsInQuote = false;
  for (let i = 0; i < words.length; i++) {
    // Don't end chunk in a quote or before the end of a sentence
    if (
      currentChunk.length > chunkSize &&
      !iteratorIsInQuote &&
      currentChunk[currentChunk.length - 1].includes(".")
    ) {
      chunks.push(currentChunk.join(" "));
      currentChunk = [];
    }

    if (words[i].includes('"')) {
      iteratorIsInQuote = !iteratorIsInQuote;
    }

    currentChunk.push(words[i]);
  }

  return chunks;
}

export type DialogueByCharacter = {
  [characterName: string]: string[];
};
async function sortDialogueByCharacter(chunks: string[]) {
  let chunkRetries = 0;
  let dialogueByCharacter: DialogueByCharacter = {};
  for (let i = 0; i < chunks.length; i++) {
    console.log(
      "Processing chunk " +
        i +
        " of " +
        chunks.length +
        " with length " +
        chunks[i].length
    );
    const encounteredCharacters = Object.keys(
      dialogueByCharacter
    );
    let completion;
    try {
      const { systemPrompt, userPrompt } = buildPrompt(
        chunks[i],
        encounteredCharacters
      );
      const completionResponse = await getGroqChatCompletion(
        systemPrompt,
        userPrompt
      );
      completion =
        completionResponse.choices[0]?.message?.content || "";
    } catch (error) {
      console.error(
        "Failed to get completion. Retrying completion."
      );
      i -= 1;
      continue;
    }

    let dialogueData;
    try {
      dialogueData = extractJsonFromCompletion(completion);
    } catch (error) {
      console.error(
        "Failed to parse JSON. Retrying completion. Chunk retries: " +
          ++chunkRetries
      );

      i -= 1;
      continue;
    }
    chunkRetries = 0;

    for (const character in dialogueData) {
      if (dialogueByCharacter[character]) {
        dialogueByCharacter[character].push(
          ...dialogueData[character]
        );
      } else {
        dialogueByCharacter[character] =
          dialogueData[character];
      }
    }
  }
  return dialogueByCharacter;
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
  encounteredCharacters: string[]
): {
  systemPrompt: string;
  userPrompt: string;
} {
  const systemPrompt = `
  You will extract each line of dialogue from an input text and put it into a JSON formatted collection of other lines of dialogue said by that character. The text could come from any part of the book, as the book will be broken up into
  chunks and the dialogue collected incrimentally. You will be provided with a list of characters that have already been encountered. Try to assign the dialogue to one of these characters, as the name they are addressed by may change throughout the book.
  For example, if you are provided with an already encountered character "Sherlock Holmes", any dialogue in the text from "Sherlock" or "Holmes" would be put into an array keyed with "Sherlock Holmes".
  Here is an example of the input text:
  Bob and Alice crossed paths in the park. Bob greeted, “Hello.” Alice smiled, replying, “Good day.” Bob asked, “How are you?” Alice nodded, “I am well.” As they parted ways, Bob waved, saying, “Goodbye.” Alice echoed, “Farewell.”

  Here is an example of the expected output:  
  { "Bob": ["Hello", "How are you?", "Goodbye"], "Alice": ["Good day", "I am well", "Farewell"] }. 
  
  Respond ONLY with valid JSON.
  The lines of dialogue should not contain quotation mark characters. If you do encounter this, escape them with a backslash to preserve the JSON format.
  `;

  const userPrompt = `
  ${
    encounteredCharacters.length
      ? "Here is a list of characters that have already been encountered: " +
        encounteredCharacters.join(", ") +
        ". \n"
      : ""
  }
  Here is the input text: 
  ${chunk}
  Now produce the expected output. Respond ONLY with valid JSON.
  `;
  return { systemPrompt, userPrompt };
}

export function extractJsonFromCompletion(completion: string) {
  const firstCurlyBracketIndex = completion.indexOf("{");
  const lastCurlyBracketIndex = completion.lastIndexOf("}");
  const jsonString = completion.substring(
    firstCurlyBracketIndex,
    lastCurlyBracketIndex + 1
  );

  return JSON.parse(jsonString);
}
