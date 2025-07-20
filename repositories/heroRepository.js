import { ObjectId } from 'mongodb';
import connectDB from '../db.js';

async function getHeroes() {
    const db = await connectDB();
    return await db.collection('superheroes').find().toArray();
}

async function insertHero(hero) {
    const db = await connectDB();
    // Generar un id incremental
    const lastHero = await db.collection('superheroes').find().sort({ id: -1 }).limit(1).toArray();
    const newId = lastHero.length > 0 ? lastHero[0].id + 1 : 1;
    hero.id = newId;
    const result = await db.collection('superheroes').insertOne(hero);
    return { ...hero, _id: result.insertedId };
}

async function updateHero(id, updatedHero) {
    const db = await connectDB();
    const result = await db.collection('superheroes').findOneAndUpdate(
        { id: parseInt(id) },
        { $set: updatedHero },
        { returnDocument: 'after' }
    );
    return result.value;
}

async function deleteHero(id) {
    const db = await connectDB();
    const result = await db.collection('superheroes').deleteOne({ id: parseInt(id) });
    if (result.deletedCount === 0) {
        throw new Error('Héroe no encontrado');
    }
    return { message: 'Héroe eliminado' };
}

export default {
    getHeroes,
    insertHero,
    updateHero,
    deleteHero
};
