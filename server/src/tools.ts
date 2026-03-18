import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeEmbeddings } from "@langchain/pinecone";

const getVectorStore = async () => {
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

  const embeddings = new PineconeEmbeddings({ model: "llama-text-embed-v2" });

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
  });

  return vectorStore;
};

const handleSearchTool = async ({ query }: { query: string }) => {
  const vectorStore = await getVectorStore();
  const results = await vectorStore.similaritySearch(query, 5);

  if (!results) {
    return "No relevant information found in the knowledge base.";
  }

  return results.map((doc) => doc.pageContent).join("\n");
};

export const searchTool = tool(handleSearchTool, {
  name: "search_tool",
  description: "Searches the internal knowledge base for technical info and documentation. Use this when you need to find information from uploaded PDF documents.",
  schema: z.object({
    query: z
      .string()
      .describe("The search query to look up in the knowledge base"),
  }),
});
