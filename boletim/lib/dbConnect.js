import mongoose from "mongoose";

export default async function dbConnect() {
  require("dotenv").config();
  const mongodb_url = `mongodb://${process.env.USER_NAME}:${process.env.PASS_DB}@172.17.0.2:27017/boletim?authSource=admin`;

  let cached = global.mongoose; //define uma variável global da conexão com o banco
  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }

  //tendo uma conexão aberta é reutilizada
  if (cached.conn) {
    return cached.dbConnect;
  }

  // Garante que apenas uma tentativa de conexão esteja pendente por vez
  if (!cached.promisse) {
    //conecta com o banco de dados
    cached.promise = mongoose.connect(mongodb_url).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
