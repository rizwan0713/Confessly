import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { LanguageModelV1 } from '@ai-sdk/provider';
import { streamText, StreamingTextResponse } from "ai";
import { request} from "http";
import { generateText } from 'ai';

import { Response } from 'express'; // Assuming you are using Express for handling HTTP requests



const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const maxDuration = 30;

export async function POST(request: Request ,response: Response) {
  try {
    const message = await request.json();
    const userPrompt = message.prompt;
    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be based on the input that user provide and Any suggested message does not exceed length of 100 Character. Below is the input that user had provided : 
     ${userPrompt} .`;

     const model = google('models/gemini-1.5-pro-latest');

     const result = await streamText({
    
      model: model as any,
      prompt: prompt,
    });
    console.log("result is:",result);
    

     return new StreamingTextResponse(result.toAIStream());
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    throw error;
  }
}


