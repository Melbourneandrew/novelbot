import pdfParse from "pdf-parse";
import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY must be set");
}
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function extractDialogue(contentLink: string) {
  const bookContent = await fetchContent(contentLink);
  const chunks = await chunkText(bookContent, 5000);

  const dialogueByCharacter = await sortDialogueByCharacter(chunks);

  console.log("Finished extracting dialogue");
}

async function fetchContent(contentLink: string) {
  const response = await fetch(contentLink);
  const pdfData = await pdfParse(Buffer.from(await response.arrayBuffer()));
  return pdfData.text;
}

/**
 * Split text into specifed length chunks.
 * Will go over chunkSize if chunk will end in the middle of a quote or sentence
 */
async function chunkText(text: string, chunkSize: number): Promise<string[]> {
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

type DialogueByCharacter = {
  [character: string]: string[];
};
async function sortDialogueByCharacter(chunks: string[]) {
  let chunkRetries = 0;
  let dialogueByCharacter: DialogueByCharacter = {};
  for (let i = 0; i < chunks.length; i++) {
    console.log("Processing chunk " + i + " with length " + chunks[i].length);
    const completionResponse = await getGroqChatCompletion(
      buildPrompt(chunks[i])
    );
    const completion = completionResponse.choices[0]?.message?.content || "";

    const jsonString = extractJsonStringFromCompletion(completion);
    let dialogueData;
    try {
      dialogueData = JSON.parse(jsonString);
    } catch (error) {
      console.error(
        "Failed to parse JSON. Retrying completion. Chunk retries: " +
          ++chunkRetries
      );
      console.log(jsonString);

      i -= 1;
      continue;
    }
    chunkRetries = 0;

    for (const character in dialogueData) {
      if (dialogueByCharacter[character]) {
        dialogueByCharacter[character].push(...dialogueData[character]);
      } else {
        dialogueByCharacter[character] = dialogueData[character];
      }
    }
  }

  console.log(dialogueByCharacter);
}

async function getGroqChatCompletion(prompt: string) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.1-70b-versatile",
    temperature: 0,
  });
}

function buildPrompt(chunk: string) {
  return `Extract each line of dialogue from the real input text and put it into a JSON formatted collection of other lines of dialogue said by that character. 

  Here is an example of the input text:
  Bob and Alice crossed paths in the park. Bob greeted, “Hello.” Alice smiled, replying, “Good day.” Bob asked, “How are you?” Alice nodded, “I am well.” As they parted ways, Bob waved, saying, “Goodbye.” Alice echoed, “Farewell.”

  Here is an example of the expected output:  
  { "Bob": ["Hello", "How are you?", "Goodbye"], "Alice": ["Good day", "I am well", "Farewell"] }. 
  
  Respond ONLY with valid JSON.
  The lines of dialogue should not contain quotation mark characters. If you do encounter this, escape them with a backslash to preserve the JSON format.
  Here is the real input text: 
  ${chunk}
  Now produce the expected output. Respond ONLY with valid JSON.
  `;
}

function extractJsonStringFromCompletion(completion: string) {
  const firstCurlyBracketIndex = completion.indexOf("{");
  const lastCurlyBracketIndex = completion.lastIndexOf("}");
  const jsonString = completion.substring(
    firstCurlyBracketIndex,
    lastCurlyBracketIndex + 1
  );

  return jsonString;
}

//WIP
function tryEscapingQuotesBetweenCommas(jsonString: string): string {
  const jsonFormattingCharactersList = [
    ",",
    String.fromCharCode(10), //newline,
    String.fromCharCode(32), //space
  ];
  let isInArray = false;
  let isInQuote = false;
  for (let i = 0; i < jsonString.length - 3; i++) {
    if (jsonString[i] == "[") {
      isInArray = true;
      continue;
    }
    if (jsonString[i] == "]") {
      isInArray = false;
      continue;
    }
    if (!isInArray) {
      continue;
    }
    if (jsonString[i] == '"' && !isInQuote) {
      isInQuote = true;
      continue;
    }
    if (jsonString[i] == '"') {
      let escapedQuote = false;
      for (let j = i + 1; j < i + 4; j++) {
        if (!jsonFormattingCharactersList.includes(jsonString[j])) {
          jsonString = jsonString.slice(0, i) + "\\" + jsonString.slice(i);
          i++;
          escapedQuote = true;
          break;
        }
      }
      if (escapedQuote) {
        continue;
      } else {
        isInQuote = false;
      }
    }
  }
  return jsonString;
}
