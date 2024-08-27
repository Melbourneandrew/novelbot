import { OpenAI } from "openai";
const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY || "";
if (OPENAI_API_KEY === "") {
  console.error("OPENAI_API_KEY environment variable not set");
}

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});
