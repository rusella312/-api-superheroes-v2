import connectDB from "./db.js";

(async () => {
  const db = await connectDB();
  const collections = await db.collections();
  console.log("Colecciones:", collections.map(c => c.collectionName));
  process.exit();
})(); 