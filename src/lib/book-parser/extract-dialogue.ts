import pdfParse from "pdf-parse";
import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY must be set");
}
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function extractDialogue(contentLink: string) {
  const bookContent = await fetchContent(contentLink);
  const chunks = await chunkText(bookContent, 5000);

  const dialogueByCharacter = await sortDialogueByCharacter(
    chunks
  );

  console.log("Finished extracting dialogue");
}

async function fetchContent(contentLink: string) {
  const response = await fetch(contentLink);
  const pdfData = await pdfParse(
    Buffer.from(await response.arrayBuffer())
  );
  return pdfData.text;
}

async function chunkText(
  text: string,
  chunkSize: number
): Promise<string[]> {
  const words = text.replace(/\n/g, " ").split(" ");
  const chunks = [];
  let currentChunk = [];

  let iteratorIsInQuote = false;
  for (let i = 0; i < words.length; i++) {
    if (currentChunk.length > chunkSize && !iteratorIsInQuote) {
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
  const prompt = `Extract each line of dialogue from this text and put it into a JSON formatted collection of other 
  lines of dialogue said by that character. Here is an example of what the output
  should be formatted:  
  { Bob: ['Hello', 'How are you?', 'Goodbye'], Alice: ['Good day', 'I am well', 'Farewell'] }. Respond ONLY with JSON.
   The lines of dialogue should not contain quotation mark characters. If you do encounter this, escape them with a backslash to preserve the JSON format.
   Here is the text: `;

  let chunkRetries = 0;
  let dialogueByCharacter: DialogueByCharacter = {};
  for (let i = 0; i < chunks.length; i++) {
    console.log("Processing chunk " + i);
    const completionResponse = await getGroqChatCompletion(
      prompt.replace(/[\n\r]/g, "") + chunks[i]
    );
    const completion =
      completionResponse.choices[0]?.message?.content || "";

    const jsonString =
      extractJsonStringFromCompletion(completion);
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
        dialogueByCharacter[character].push(
          ...dialogueData[character]
        );
      } else {
        dialogueByCharacter[character] =
          dialogueData[character];
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
function tryEscapingQuotesBetweenCommas(jsonString: string) {
  const jsonStringArray = jsonString.split(",");
  for (let i = 0; i < jsonStringArray.length; i++) {
    let str = jsonStringArray[i];
    /*
    Handle case of the end of the string array like this:
    {
        "Holmes": [
            "Now, what did you gather from that woman’s appearance?",
            "Describe it."
    --> ],
        "Watson": [ 
            "And how could you guess what the motive was?", <--
        ]
    }
    */
    if (str.includes(": [")) {
      str = str.substring(str.indexOf(": [") + 3);
    }
    const indexOfFirstQuote = str.indexOf('"');
    const indexOfLastQuote = str.lastIndexOf('"');
    if (indexOfFirstQuote === -1 || indexOfLastQuote === -1) {
      continue;
    }

    for (
      let j = indexOfFirstQuote + 1;
      j < indexOfLastQuote;
      j++
    ) {
      if (str[j] === '"') {
        str = str.slice(0, j) + "\\" + str.slice(j);
      }
    }
  }
  return jsonStringArray.join(",");
}
