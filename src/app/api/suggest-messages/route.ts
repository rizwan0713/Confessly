import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt: userPrompt } = await request.json();

    const systemInstruction =
      "You are a creative assistant for an anonymous messaging platform like Qooh.me. Generate exactly three engaging, open-ended questions separated by '||'. Keep each question under 100 characters. Do not number them or add any other text.";

    const userMessage = userPrompt
      ? `Create 3 engaging questions based on this input: "${userPrompt}". Separate them with '||'.`
      : "Create 3 fun, open-ended questions separated with '||'.";

    const promptText = `${systemInstruction}\n\n${userMessage}`;

    const result = await streamText({
      model: google("models/gemini-3.6-flash") as any,
      prompt: promptText,
    });


    return new StreamingTextResponse(result.toAIStream());
  } catch (error: any) {
    console.error("Error in suggest-messages API:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to generate suggestions",
      },
      { status: 500 }
    );
  }
}
