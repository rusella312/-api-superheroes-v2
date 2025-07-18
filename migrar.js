import { readFile } from 'fs/promises';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function migrate() {
  try {
    await client.connect();
    const db = client.db();

    // Leer y migrar superhéroes
    const heroesData = JSON.parse(await readFile('./superheroes.json', 'utf-8'));
    const heroesCollection = db.collection('superheroes');
    await heroesCollection.deleteMany({}); // Limpia la colección antes de migrar
    const heroesResult = await heroesCollection.insertMany(heroesData);
    console.log(`Superhéroes migrados correctamente. Insertados: ${heroesResult.insertedCount}`);

    // Mapear id antiguo a _id de MongoDB
    const idMap = {};
    Object.values(heroesResult.insertedIds).forEach((mongoId, idx) => {
      const oldId = heroesData[idx].id;
      idMap[oldId] = mongoId;
    });

    // Leer y migrar mascotas
    const petsData = JSON.parse(await readFile('./pets.json', 'utf-8'));
    const petsCollection = db.collection('pets');

    // Actualizar el ownerId de las mascotas
    const updatedPetsData = petsData.map(pet => {
      if (pet.ownerId && idMap[pet.ownerId]) {
        pet.ownerId = idMap[pet.ownerId];
      } else {
        pet.ownerId = null;
      }
      return pet;
    });

    await petsCollection.deleteMany({}); // Limpia la colección antes de migrar
    const petsResult = await petsCollection.insertMany(updatedPetsData);
    console.log(`Mascotas migradas correctamente. Insertadas: ${petsResult.insertedCount}`);

  } catch (error) {
    console.error('Error en la migración:', error);
  } finally {
    await client.close();
    process.exit();
  }
}

migrate(); 