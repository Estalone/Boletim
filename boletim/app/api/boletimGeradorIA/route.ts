import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function GET(request: Request) {
  require("dotenv").config();

  const ai = new GoogleGenAI({
    apiKey: process.env.KEY_API_GEMINI_AI,
  });

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: "Esplane como a ia pode ajuar as pessoas",
  });

  return NextResponse.json({ menssage: response }, { status: 500 });
}
