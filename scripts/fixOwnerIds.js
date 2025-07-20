import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function fixOwnerId() {
  try {
    await client.connect();
    const db = client.db(); // Usa el nombre de tu base si es necesario
    // Cambia el nombre y el id por los que correspondan a tu caso
    const superheroeId = '687a66892f50daae8138826a';
    const mascotaName = 'tobi';
    const result = await db.collection('pets').updateOne(
      { name: mascotaName },
      { $set: { ownerId: new ObjectId(superheroeId) } }
    );
    if (result.modifiedCount > 0) {
      console.log(`ownerId de la mascota '${mascotaName}' actualizado correctamente.`);
    } else {
      console.log(`No se encontró la mascota '${mascotaName}' o ya tenía el ownerId correcto.`);
    }
  } catch (err) {
    console.error('Error actualizando ownerId:', err);
  } finally {
    await client.close();
  }
}

fixOwnerId(); 