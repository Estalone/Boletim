import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import mongoose, { Schema } from "mongoose";

export async function POST(req: Request) {
  try {
    //faz a conexão com o banco de dados
    await dbConnect();

    const client =
      mongoose.models.boletimSemanal ||
      mongoose.model(
        "boletimSemanal",
        new Schema({}, { collection: "boletimSemanal" })
      );

    const data = await client.find({});

    return NextResponse.json(
      { message: "Conectado", result: data },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      {
        message: "Erro: Erro ao conectar com o banco de dados",
        codeName: err.codeName,
      },
      { status: 500 }
    );
  }
}
