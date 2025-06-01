import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  require("dotenv").config();

  const data = await request.json(),
    projetoSelecionado = data.projeto,
    texto = data.texto;

  const projetos = {
    saudeSimples2: "Saúde Simples",
    GED: "GED",
    outsourcing: "Outsourcing",
    DOC: "DOC+ Simples",
    educacaoSimples: "Educação Simples",
  };

  type projetoSelecionadoExistente = keyof typeof projetos;

  if (projetoSelecionado in projetos) {
    const ai = new GoogleGenAI({
      apiKey: process.env.KEY_API_GEMINI_AI,
    });

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Faça um texto corrido e curto como um boletim semanal do produto ${
        projetos[projetoSelecionado as projetoSelecionadoExistente]
      }, 
        para ser exibido ao cliente em português com as seguintes informações: 
        sem comentários, sem texto com negrito, sem quebra de linha.
        Começe com: "Nesta semana, o time do Saúde Simples..." ou "A equipe do Saúde Simples, nesta semana..."
        podendo mudar de acordo com a concordancia
        : ${texto}`,
    });

    return NextResponse.json({ message: response.text }, { status: 200 });
  } else {
    return NextResponse.json(
      { message: "Erro interno: Projeto não encontrado" },
      { status: 400 }
    );
  }
}
