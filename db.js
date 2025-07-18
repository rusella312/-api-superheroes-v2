import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useUnifiedTopology: true });

let db;

export async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(); // Usa el nombre de la base de datos de la URI o la default
    console.log("Conectado a MongoDB Atlas");
  }
  return db;
}

export default connectDB; 