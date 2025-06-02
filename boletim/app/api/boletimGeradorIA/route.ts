import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  require("dotenv").config();
  //pega as informações digitadas
  const data = await request.json(),
    projetoSelecionado = data.projeto,
    texto = data.texto;
  //objeto para traduzir o pojeto selecionado
  const projetos = {
    saudeSimples: "Saúde Simples",
    GED: "GED",
    outsourcing: "Outsourcing",
    DOC: "DOC+ Simples",
    educacaoSimples: "Educação Simples",
  };

  type projetoAjuste = keyof typeof projetos;

  if (projetoSelecionado in projetos) {
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.KEY_API_GEMINI_AI,
      });

      const projeto = projetos[projetoSelecionado as projetoAjuste];

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `Faça um texto corrido e curto como um boletim semanal do produto ${projeto},
        para ser exibido ao cliente em português com as seguintes informações:
        sem comentários, sem texto com negrito, sem quebra de linha, sem adicionar algo a mais do que foi escrito.
        Começe com: "Nesta semana, o time do ${projeto}", "A equipe do ${projeto}, nesta semana..." ou "O time do ${projeto}..."
        podendo mudar de acordo com a concordância
        : ${texto}`,
      });

      return NextResponse.json({ message: response.text }, { status: 200 });
    } catch {
      return NextResponse.json(
        { message: "Erro 500: Houve um erro na hora de buscar os dados." },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Erro 400: Projeto não encontrado" },
      { status: 400 }
    );
  }
}
