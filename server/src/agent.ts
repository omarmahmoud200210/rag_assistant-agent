import { createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph-checkpoint";
import { ChatGroq } from "@langchain/groq";
import { searchTool } from "./tools";

const checkpointer = new MemorySaver();

export async function runAgent(message: string) {
  try {
    const prompt = `You are a helpful AI assistant with access to a knowledge base. You must use the search_tool to find relevant information before answering. Be concise and accurate. Do not hallucinate tool calls.`;

    const model = new ChatGroq({
      model: "llama-3.3-70b-versatile",
      apiKey: process.env.GROQ_API_KEY,
      temperature: 0,
    });

    const agent = createAgent({
      model,
      tools: [searchTool],
      checkpointer,
      systemPrompt: prompt,
    });

    const result = await agent.invoke(
      {
        messages: [{ role: "user", content: message }],
      },
      { configurable: { thread_id: "default-user-session" } },
    );

    const lastMessage = result.messages[result.messages.length - 1].content;

    return { output: lastMessage || "" };
  } catch (error) {
    console.log(error);
    return { output: "Internal server error" };
  }
}
