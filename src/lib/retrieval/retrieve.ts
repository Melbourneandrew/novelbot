import { Pinecone } from "@pinecone-database/pinecone";
import { pineconeClient } from "./vector-db";
import OpenAI from "openai";
import { QueryResponse } from "@pinecone-database/pinecone";
import { openai } from "../util/OpenAiClient";
const PINECONE_INDEX_NAME: string = process.env.PINECONE_INDEX_NAME || "";
if (PINECONE_INDEX_NAME === "") {
  console.error(
    "PINECONE_INDEX_NAME, OPENAI_API_KEY, or PINECONE_NAMESPACE environment variable not set"
  );
}

export async function retrieveRelevantDialogue(
  queryText: string,
  namespace: string
): Promise<string[]> {
  const pineconeIndex = pineconeClient.index(PINECONE_INDEX_NAME);
  const embeddings = await openai.embeddings.create({
    model: "text-embedding-small",
    input: queryText,
  });

  const queryResponse: QueryResponse = await pineconeIndex
    .namespace(namespace)
    .query({
      vector: embeddings.data[0].embedding,
      topK: 5,
      includeMetadata: true,
    });
  console.log(queryResponse.matches);
  const relevantDialogue: string[] = [];
  queryResponse.matches?.forEach((match) => {
    // @ts-ignore
    relevantDialogue.push(match.metadata?.text);
  });
  console.log("Relevant Dialogue retrieved from Pinecone");
  console.log(relevantDialogue);
  return relevantDialogue;
}
