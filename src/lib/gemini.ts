import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateContent(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Sorry, I couldn't process your request. Please check your API key.";
  }
}

export async function getNewsSummary(newsData: string): Promise<string> {
  const prompt = `You are a UPSC exam expert. Analyze and summarize the following news for UPSC preparation. Categorize it as Current Affairs, Editorial, or Analysis. Provide a brief summary suitable for UPSC prelims and mains:\n\n${newsData}`;
  return generateContent(prompt);
}

export async function chatWithFile(
  fileContent: string,
  userMessage: string,
  chatHistory: { role: string; content: string }[]
): Promise<string> {
  const context = `You are a helpful UPSC exam tutor. The user is studying the following content:\n\n${fileContent}\n\nProvide helpful explanations and answer questions related to this content.`;
  
  const historyText = chatHistory
    .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
    .join("\n");

  const prompt = `${context}\n\nConversation:\n${historyText}\nUser: ${userMessage}\nAssistant:`;
  
  return generateContent(prompt);
}
