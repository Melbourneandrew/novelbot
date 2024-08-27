import { Pinecone } from "@pinecone-database/pinecone";
import { pineconeClient } from "./vector-db";
import OpenAI from "openai";

const PINECONE_INDEX_NAME: string = process.env.PINECONE_INDEX_NAME || "";
const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY || "";
if (PINECONE_INDEX_NAME === "" || OPENAI_API_KEY === "") {
  console.error(
    "PINECONE_INDEX_NAME, OPENAI_API_KEY, or PINECONE_NAMESPACE environment variable not set"
  );
}

export async function upsertText(text: string[], namespace: string) {
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });
  const pineconeIndex = pineconeClient.index(PINECONE_INDEX_NAME);
  console.log("Creating embeddings...");
  const embeddings = await openai.embeddings.create({
    model: "text-embedding-small",
    input: text,
  });
  console.log("Embeddings created.");

  const vectors = embeddings.data.map((embedding, index: number) => {
    return {
      id: "" + index,
      values: embedding.embedding,
      metadata: { text: text[index] },
    };
  });
  console.log("Upserting processed embeddings...");
  //Upsert vectors into pinecone index
  const pineconeUpsertResponse = await pineconeIndex
    .namespace(namespace)
    .upsert(vectors);
  console.log("Vectors upserted.");
  return true;
}
