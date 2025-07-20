import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function fixOwnerIds() {
  try {
    await client.connect();
    const db = client.db();
    const pets = await db.collection('pets').find({ ownerId: { $type: 'string' } }).toArray();
    for (const pet of pets) {
      await db.collection('pets').updateOne(
        { _id: pet._id },
        { $set: { ownerId: new ObjectId(pet.ownerId) } }
      );
      console.log(`Mascota ${pet.name} corregida`);
    }
    console.log('¡Todos los ownerId corregidos!');
  } catch (err) {
    console.error('Error corrigiendo ownerIds:', err);
  } finally {
    await client.close();
  }
}

fixOwnerIds(); 