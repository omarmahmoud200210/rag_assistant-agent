import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeEmbeddings } from "@langchain/pinecone";
import { PineconeStore } from "@langchain/pinecone";

export const ingest = async (filePath: string) => {
  // 1. Conver the PDF to text
  const loader = new PDFLoader(filePath);
  const docs = await loader.load();

  // 2. Splitting the text into chuncks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await splitter.splitDocuments(docs);

  // 3. Connect to Pinecone
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const index = pc.Index(process.env.PINECONE_INDEX_NAME!);
  
  // 4. Create Embeddings
  const embeddings = new PineconeEmbeddings({ model: "llama-text-embed-v2" });

  // 5. Store the embeddings in Pinecone
  const store = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
  });

  const BATCH_SIZE = 96;

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    await store.addDocuments(batch);
  }

  console.log("Ingestion Completed");
};
