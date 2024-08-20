import { Pinecone } from "@pinecone-database/pinecone";
var pineconeClient: any;

function connectPinecone() {
  if (process.env.PINECONE_API_KEY === "") {
    console.error(
      "PINECONE_API_KEY environment variable not set"
    );
    return;
  }

  pineconeClient = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || "",
  });
  console.log("Connected to pinecone");
}

export { pineconeClient, connectPinecone };
